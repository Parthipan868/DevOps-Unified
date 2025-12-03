import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Star,
    GitBranch,
    GitPullRequest,
    Play,
    ExternalLink,
    Github
} from 'lucide-react';
import { cn } from '../lib/utils';

const RepoCard = ({ repo }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Github size={24} className="text-gray-900 dark:text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${repo.languageColor}`}></span>
                        {repo.language}
                    </p>
                </div>
            </div>
            <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Star size={20} fill={repo.isFavorite ? "currentColor" : "none"} className={repo.isFavorite ? "text-yellow-400" : ""} />
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Stars</p>
                <p className="font-bold text-gray-900 dark:text-white">{repo.stars}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Forks</p>
                <p className="font-bold text-gray-900 dark:text-white">{repo.forks}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Issues</p>
                <p className="font-bold text-gray-900 dark:text-white">{repo.openIssues}</p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Commits">
                    <GitBranch size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Pull Requests">
                    <GitPullRequest size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Trigger Workflow">
                    <Play size={18} />
                </button>
            </div>
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                View on GitHub <ExternalLink size={14} />
            </a>
        </div>
    </div>
);

const GitHubTab = () => {
    const [filter, setFilter] = useState('all');
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Language color mapping
    const getLanguageColor = (language) => {
        const colors = {
            'JavaScript': 'bg-yellow-400',
            'TypeScript': 'bg-blue-600',
            'Python': 'bg-blue-500',
            'Java': 'bg-red-500',
            'Go': 'bg-cyan-400',
            'Rust': 'bg-orange-600',
            'C++': 'bg-pink-500',
            'C': 'bg-gray-500',
            'Ruby': 'bg-red-600',
            'PHP': 'bg-purple-500',
            'Swift': 'bg-orange-500',
            'Kotlin': 'bg-purple-600',
            'Dart': 'bg-blue-400',
            'Shell': 'bg-green-500',
            'HTML': 'bg-orange-400',
            'CSS': 'bg-blue-400',
        };
        return colors[language] || 'bg-gray-400';
    };

    const fetchRepos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/github/repos');
            if (response.ok) {
                const data = await response.json();
                // Transform data to include languageColor
                const transformedData = data.map(repo => ({
                    ...repo,
                    id: repo._id || repo.id,
                    languageColor: getLanguageColor(repo.language),
                    isFavorite: false // Can be extended later with user preferences
                }));
                setRepos(transformedData);
            }
        } catch (error) {
            console.error('Error fetching repos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncRepos = async () => {
        setSyncing(true);
        try {
            const response = await fetch('http://localhost:5000/api/github/sync', {
                method: 'POST',
            });
            if (response.ok) {
                await fetchRepos();
                alert('Repositories synced successfully!');
            } else {
                alert('Failed to sync repositories. Please check your GitHub token.');
            }
        } catch (error) {
            console.error('Error syncing repos:', error);
            alert('Error syncing repositories');
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading repositories...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Repositories</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your code repositories.</p>
                </div>
                <button
                    onClick={handleSyncRepos}
                    disabled={syncing}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Github size={18} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? 'Syncing...' : 'Sync Repositories'}
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Languages</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="go">Go</option>
                        <option value="python">Python</option>
                    </select>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Repo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map(repo => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
};

export default GitHubTab;
