import React, { useState, useEffect } from 'react';
import {
    PlayCircle,
    StopCircle,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Terminal,
    MoreVertical,
    History
} from 'lucide-react';
import { cn } from '../lib/utils';

const StatusBadge = ({ status }) => {
    const styles = {
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        running: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        aborted: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    };

    const icons = {
        success: <CheckCircle2 size={14} />,
        failed: <XCircle size={14} />,
        running: <Clock size={14} className="animate-spin" />,
        aborted: <AlertCircle size={14} />
    };

    return (
        <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", styles[status.toLowerCase()] || styles.aborted)}>
            {icons[status.toLowerCase()]}
            {status}
        </span>
    );
};

const PipelineCard = ({ pipeline, onTriggerBuild, onViewLogs }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Terminal size={24} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{pipeline.name}</h3>
                        <p className="text-sm text-gray-500">Last build: #{pipeline.lastBuildId}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <StatusBadge status={pipeline.status} />
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {pipeline.duration}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    <History size={14} />
                    {pipeline.lastRun}
                </span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                    className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        pipeline.status === 'Success' ? "bg-green-500" :
                            pipeline.status === 'Failed' ? "bg-red-500" :
                                pipeline.status === 'Running' ? "bg-yellow-500" : "bg-gray-500"
                    )}
                    style={{ width: pipeline.health + '%' }}
                />
            </div>
            <p className="text-xs text-right text-gray-500 mb-4">Health: {pipeline.health}%</p>

            <div className="grid grid-cols-2 gap-3">
                <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pipeline.status === 'Running'}
                    onClick={() => onTriggerBuild(pipeline.name)}
                >
                    <PlayCircle size={16} />
                    Build Now
                </button>
                <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => onViewLogs(pipeline.name)}
                >
                    <Terminal size={16} />
                    View Logs
                </button>
            </div>
        </div>
    </div>
);

const LogViewer = ({ isOpen, onClose, title, logs, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <Terminal size={20} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <XCircle size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Clock className="animate-spin mr-2" /> Loading logs...
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap">{logs || 'No logs available.'}</pre>
                    )}
                </div>
            </div>
        </div>
    );
};

const JenkinsTab = () => {
    const [pipelines, setPipelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logViewer, setLogViewer] = useState({ isOpen: false, pipelineName: '', logs: '', loading: false });

    useEffect(() => {
        const fetchPipelines = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/jenkins/pipelines');
                if (response.ok) {
                    const data = await response.json();
                    // Map backend data format to frontend format
                    const mappedData = data.map(pipeline => ({
                        id: pipeline._id,
                        name: pipeline.name,
                        status: pipeline.lastBuild?.status || 'Unknown',
                        lastBuildId: pipeline.lastBuild?.number?.toString() || '0',
                        duration: pipeline.lastBuild?.duration
                            ? `${Math.floor(pipeline.lastBuild.duration / 60000)}m ${Math.floor((pipeline.lastBuild.duration % 60000) / 1000)}s`
                            : 'Unknown',
                        lastRun: pipeline.lastBuild?.timestamp
                            ? new Date(pipeline.lastBuild.timestamp).toLocaleString()
                            : 'Never',
                        health: pipeline.health || 0
                    }));
                    setPipelines(mappedData);
                }
            } catch (error) {
                console.error('Error fetching pipelines:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPipelines();
    }, []);

    const handleTriggerBuild = async (pipelineName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/jenkins/build/${pipelineName}`, {
                method: 'POST',
            });

            if (response.ok) {
                alert(`Build triggered for ${pipelineName}`);
                // Refresh pipelines to show running status (optional, usually takes a moment for Jenkins to update)
            } else {
                const errorData = await response.json();
                alert(`Failed to trigger build: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error triggering build:', error);
            alert('Error triggering build');
        }
    };

    const handleViewLogs = async (pipelineName) => {
        setLogViewer({ isOpen: true, pipelineName, logs: '', loading: true });
        try {
            const response = await fetch(`http://localhost:5000/api/jenkins/logs/${pipelineName}`);
            if (response.ok) {
                const data = await response.json();
                setLogViewer(prev => ({ ...prev, logs: data.logs, loading: false }));
            } else {
                setLogViewer(prev => ({ ...prev, logs: 'Failed to fetch logs.', loading: false }));
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLogViewer(prev => ({ ...prev, logs: 'Error fetching logs.', loading: false }));
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading pipelines...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Jenkins Pipelines</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and trigger your CI/CD workflows.</p>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                    <Terminal size={18} />
                    New Pipeline
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pipelines.map(pipeline => (
                    <PipelineCard
                        key={pipeline.id}
                        pipeline={pipeline}
                        onTriggerBuild={handleTriggerBuild}
                        onViewLogs={handleViewLogs}
                    />
                ))}
            </div>

            <LogViewer
                isOpen={logViewer.isOpen}
                onClose={() => setLogViewer(prev => ({ ...prev, isOpen: false }))}
                title={`Build Logs: ${logViewer.pipelineName}`}
                logs={logViewer.logs}
                loading={logViewer.loading}
            />
        </div>
    );
};

export default JenkinsTab;
