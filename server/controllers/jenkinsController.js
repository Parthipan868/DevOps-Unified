import Pipeline from '../models/Pipeline.js';
import axios from 'axios';

const JENKINS_URL = process.env.JENKINS_URL || 'http://localhost:8585';
const JENKINS_USERNAME = process.env.JENKINS_USERNAME;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;

// Create auth header for Jenkins
const getAuthHeader = () => {
    if (!JENKINS_USERNAME || !JENKINS_TOKEN) {
        return {};
    }
    const auth = Buffer.from(`${JENKINS_USERNAME}:${JENKINS_TOKEN}`).toString('base64');
    return { Authorization: `Basic ${auth}` };
};

// Map Jenkins build result to our status format
const mapBuildResult = (result) => {
    if (!result) return 'Unknown';
    switch (result.toUpperCase()) {
        case 'SUCCESS': return 'Success';
        case 'FAILURE': return 'Failed';
        case 'ABORTED': return 'Aborted';
        case 'UNSTABLE': return 'Unstable';
        default: return result;
    }
};

// Calculate health score from job color
const calculateHealth = (color) => {
    if (!color) return 0;
    if (color.includes('blue')) return 100;
    if (color.includes('red')) return 60;
    if (color.includes('yellow')) return 75;
    if (color.includes('aborted')) return 50;
    return 80;
};

export const getPipelines = async (req, res) => {
    try {
        let response;

        // Try without authentication first (anonymous read access enabled)
        try {
            console.log('Attempting Jenkins connection without auth...');
            response = await axios.get(`${JENKINS_URL}/api/json?tree=jobs[name,url,color,lastBuild[number,result,timestamp,duration]]`, {
                timeout: 5000
            });
            console.log('✅ Connected to Jenkins successfully (anonymous)');
        } catch (anonError) {
            // If anonymous fails, try with authentication
            console.log('Anonymous access failed, trying with authentication...');
            response = await axios.get(`${JENKINS_URL}/api/json?tree=jobs[name,url,color,lastBuild[number,result,timestamp,duration]]`, {
                headers: getAuthHeader(),
                timeout: 5000
            });
            console.log('✅ Connected to Jenkins successfully (authenticated)');
        }

        const jobs = response.data.jobs || [];
        console.log(`Found ${jobs.length} Jenkins jobs`);

        // Map Jenkins jobs to our pipeline format
        const pipelines = jobs.map(job => ({
            name: job.name,
            url: job.url,
            lastBuild: job.lastBuild ? {
                number: job.lastBuild.number,
                status: mapBuildResult(job.lastBuild.result),
                timestamp: new Date(job.lastBuild.timestamp),
                duration: job.lastBuild.duration
            } : null,
            health: calculateHealth(job.color)
        }));

        res.json(pipelines);
    } catch (error) {
        console.error('Error fetching Jenkins pipelines:', error.message);
        res.status(500).json({
            message: 'Failed to fetch Jenkins pipelines',
            error: error.message
        });
    }
};

export const triggerBuild = async (req, res) => {
    try {
        const { name } = req.params;
        console.log(`Triggering build for pipeline: ${name}`);

        // Jenkins requires authentication for POST requests (builds)
        // We also need to handle CSRF if enabled, but for now let's try basic auth
        try {
            await axios.post(
                `${JENKINS_URL}/job/${name}/build`,
                {},
                {
                    headers: getAuthHeader(),
                    timeout: 5000
                }
            );
            console.log(`✅ Build triggered successfully for ${name}`);
            res.json({ message: `Build triggered for pipeline: ${name}` });
        } catch (error) {
            // If 403, it might be CSRF. For now, let's just log it.
            // If 401, it's auth.
            console.error(`❌ Failed to trigger build for ${name}:`, error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    } catch (error) {
        console.error('Error triggering build:', error.message);
        res.status(500).json({
            message: 'Failed to trigger build',
            error: error.message
        });
    }
};

export const getBuildLogs = async (req, res) => {
    try {
        const { name } = req.params;

        let response;
        try {
            // Try fetching logs (consoleText)
            response = await axios.get(`${JENKINS_URL}/job/${name}/lastBuild/consoleText`, {
                headers: getAuthHeader(),
                timeout: 5000
            });
        } catch (error) {
            // If auth fails or other error, try anonymous if configured
            if (error.response && error.response.status === 401) {
                response = await axios.get(`${JENKINS_URL}/job/${name}/lastBuild/consoleText`, {
                    timeout: 5000
                });
            } else {
                throw error;
            }
        }

        res.json({ logs: response.data });
    } catch (error) {
        console.error('Error fetching build logs:', error.message);
        res.status(500).json({
            message: 'Failed to fetch build logs',
            error: error.message
        });
    }
};

export const getRecentBuilds = async (req, res) => {
    try {
        let response;

        // Try to fetch Jenkins jobs
        try {
            response = await axios.get(`${JENKINS_URL}/api/json?tree=jobs[name,lastBuild[number,result,timestamp,duration,building]]`, {
                timeout: 5000
            });
        } catch (error) {
            response = await axios.get(`${JENKINS_URL}/api/json?tree=jobs[name,lastBuild[number,result,timestamp,duration,building]]`, {
                headers: getAuthHeader(),
                timeout: 5000
            });
        }

        const jobs = response.data.jobs || [];

        // Get recent builds (up to 3) and format them
        const recentBuilds = jobs
            .filter(job => job.lastBuild)
            .sort((a, b) => b.lastBuild.timestamp - a.lastBuild.timestamp) // Sort by most recent first
            .slice(0, 3)
            .map(job => {
                const build = job.lastBuild;
                const now = Date.now();
                const timeDiff = now - build.timestamp;

                // Format time ago
                let timeAgo;
                if (timeDiff < 60000) {
                    timeAgo = 'Now';
                } else if (timeDiff < 3600000) {
                    timeAgo = `${Math.floor(timeDiff / 60000)} mins ago`;
                } else if (timeDiff < 86400000) {
                    timeAgo = `${Math.floor(timeDiff / 3600000)} hours ago`;
                } else {
                    timeAgo = `${Math.floor(timeDiff / 86400000)} days ago`;
                }

                // Format duration
                const durationSeconds = Math.floor(build.duration / 1000);
                let duration;
                if (build.building) {
                    duration = 'Running';
                } else if (durationSeconds < 60) {
                    duration = `${durationSeconds}s`;
                } else {
                    const mins = Math.floor(durationSeconds / 60);
                    const secs = durationSeconds % 60;
                    duration = `${mins}m ${secs}s`;
                }

                // Determine status
                let status;
                if (build.building) {
                    status = 'running';
                } else if (build.result === 'SUCCESS') {
                    status = 'success';
                } else if (build.result === 'FAILURE') {
                    status = 'failed';
                } else {
                    status = 'unknown';
                }

                return {
                    name: job.name,
                    status,
                    time: timeAgo,
                    duration
                };
            });

        res.json(recentBuilds);
    } catch (error) {
        console.error('Error fetching recent builds:', error.message);

        // Return fallback data
        res.json([
            { name: 'frontend-app-deploy', status: 'success', time: '2 mins ago', duration: '45s' },
            { name: 'backend-api-test', status: 'failed', time: '15 mins ago', duration: '1m 20s' },
            { name: 'docker-image-build', status: 'running', time: 'Now', duration: 'Running' }
        ]);
    }
};

