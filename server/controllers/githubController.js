import { Octokit } from '@octokit/rest';
import Repository from '../models/Repository.js';

// Debug: Check if token is loaded
console.log('GitHub Token Status:', process.env.GITHUB_TOKEN ? `Loaded (${process.env.GITHUB_TOKEN.substring(0, 10)}...)` : 'NOT FOUND');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

export const getRepos = async (req, res) => {
    try {
        console.log('Fetching repositories from GitHub...');

        // Fetch repositories from GitHub API
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'all', // Include both public and private
            affiliation: 'owner,collaborator,organization_member',
            sort: 'updated',
            per_page: 100
        });

        console.log(`Fetched ${repos.length} repositories from GitHub`);

        // Map GitHub data to our format
        const formattedRepos = repos.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'No description',
            url: repo.html_url,
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            openIssues: repo.open_issues_count,
            owner: {
                login: repo.owner.login,
                avatarUrl: repo.owner.avatar_url
            },
            lastUpdated: repo.updated_at
        }));

        // Update MongoDB with fresh data
        await Repository.deleteMany({}); // Clear old data
        await Repository.insertMany(formattedRepos);

        console.log(`Saved ${formattedRepos.length} repositories to MongoDB`);

        res.json(formattedRepos);
    } catch (error) {
        console.error('GitHub API Error:', error.message);

        // Fallback to database if API fails
        try {
            const repos = await Repository.find().sort({ lastUpdated: -1 });
            if (repos.length > 0) {
                return res.json(repos);
            }
        } catch (dbError) {
            console.error('Database Error:', dbError.message);
        }

        res.status(500).json({
            message: 'Failed to fetch repositories',
            error: error.message
        });
    }
};

export const syncRepos = async (req, res) => {
    try {
        // Trigger manual sync
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100
        });

        const formattedRepos = repos.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'No description',
            url: repo.html_url,
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            openIssues: repo.open_issues_count,
            owner: {
                login: repo.owner.login,
                avatarUrl: repo.owner.avatar_url
            },
            lastUpdated: repo.updated_at
        }));

        await Repository.deleteMany({});
        await Repository.insertMany(formattedRepos);

        res.json({
            message: 'Repositories synced successfully',
            count: formattedRepos.length
        });
    } catch (error) {
        console.error('Sync Error:', error.message);
        res.status(500).json({
            message: 'Failed to sync repositories',
            error: error.message
        });
    }
};
