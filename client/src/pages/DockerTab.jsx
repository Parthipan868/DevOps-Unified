import React, { useState, useEffect } from 'react';
import {
    Container,
    Play,
    Square,
    RefreshCw,
    Trash2,
    Terminal,
    Cpu,
    HardDrive,
    XCircle,
    Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

const ContainerCard = ({ container, onControl, onViewLogs }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Container size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white font-mono">{container.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{container.image}</p>
                    </div>
                </div>
                <div className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    container.status.startsWith('Up') || container.state === 'Running'
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        container.status.startsWith('Up') || container.state === 'Running' ? "bg-green-500 animate-pulse" : "bg-gray-500"
                    )} />
                    {container.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Cpu size={14} />
                        <span className="text-xs font-medium">CPU Usage</span>
                    </div>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white">{container.cpu}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <HardDrive size={14} />
                        <span className="text-xs font-medium">Memory</span>
                    </div>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white">{container.memory}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {container.state !== 'Running' && !container.status.startsWith('Up') ? (
                    <button
                        onClick={() => onControl(container.id, 'start')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Play size={16} /> Start
                    </button>
                ) : (
                    <button
                        onClick={() => onControl(container.id, 'stop')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Square size={16} /> Stop
                    </button>
                )}
                <button
                    onClick={() => onControl(container.id, 'restart')}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Restart"
                >
                    <RefreshCw size={18} />
                </button>
                <button
                    onClick={() => onViewLogs(container.id, container.name)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Logs"
                >
                    <Terminal size={18} />
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Remove">
                    <Trash2 size={18} />
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

const DockerTab = () => {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logViewer, setLogViewer] = useState({ isOpen: false, containerName: '', logs: '', loading: false });

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/docker/containers');
                if (response.ok) {
                    const data = await response.json();
                    setContainers(data);
                }
            } catch (error) {
                console.error('Error fetching containers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContainers();
    }, []);

    const handleControlContainer = async (id, action) => {
        try {
            const response = await fetch(`http://localhost:5000/api/docker/container/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                // Refresh containers to show new status
                const updatedContainers = containers.map(c => {
                    if (c.id === id) {
                        return {
                            ...c,
                            state: action === 'start' ? 'Running' : 'Stopped',
                            status: action === 'start' ? 'Up (just now)' : 'Exited (just now)'
                        };
                    }
                    return c;
                });
                setContainers(updatedContainers);

                // Re-fetch to get exact status from Docker
                setTimeout(async () => {
                    const res = await fetch('http://localhost:5000/api/docker/containers');
                    if (res.ok) {
                        const data = await res.json();
                        setContainers(data);
                    }
                }, 1000);
            } else {
                const errorData = await response.json();
                alert(`Failed to ${action} container: ${errorData.message}`);
            }
        } catch (error) {
            console.error(`Error ${action}ing container:`, error);
            alert(`Error ${action}ing container`);
        }
    };

    const handleViewLogs = async (containerId, containerName) => {
        setLogViewer({ isOpen: true, containerName, logs: '', loading: true });
        try {
            const response = await fetch(`http://localhost:5000/api/docker/logs/${containerId}`);
            if (response.ok) {
                const data = await response.json();
                // Basic cleanup of control characters if needed
                // const cleanLogs = data.logs.replace(/[\u0000-\u001F]/g, "");
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
        return <div className="text-center py-10 text-gray-500">Loading containers...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Docker Containers</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your local container infrastructure.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Container size={18} />
                    Pull Image
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {containers.map(container => (
                    <ContainerCard
                        key={container.id}
                        container={container}
                        onControl={handleControlContainer}
                        onViewLogs={handleViewLogs}
                    />
                ))}
            </div>

            <LogViewer
                isOpen={logViewer.isOpen}
                onClose={() => setLogViewer(prev => ({ ...prev, isOpen: false }))}
                title={`Container Logs: ${logViewer.containerName}`}
                logs={logViewer.logs}
                loading={logViewer.loading}
            />
        </div>
    );
};

export default DockerTab;
