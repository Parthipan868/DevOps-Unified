import React, { useState, useEffect } from 'react';
import {
    GitBranch,
    GitCommit,
    GitPullRequest,
    Star,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Box
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            {trend && (
                <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    {trendUp ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const DashboardHome = () => {
    const [stats, setStats] = useState({
        repoCount: 0,
        pipelineCount: 0,
        containerCount: 0,
        buildSuccessRate: 0
    });
    const [recentBuilds, setRecentBuilds] = useState([]);
    const [githubActivity, setGithubActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch stats
                const statsResponse = await fetch('http://localhost:5000/api/stats');
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData);
                }

                // Fetch recent builds
                const buildsResponse = await fetch('http://localhost:5000/api/jenkins/recent-builds');
                if (buildsResponse.ok) {
                    const buildsData = await buildsResponse.json();
                    setRecentBuilds(buildsData);
                }

                // Fetch GitHub activity
                const activityResponse = await fetch('http://localhost:5000/api/github/activity');
                if (activityResponse.ok) {
                    const activityData = await activityResponse.json();
                    setGithubActivity(activityData);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Repositories"
                    value={stats.repoCount}
                    icon={GitBranch}
                    trend="2.5"
                    trendUp={true}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Pipelines"
                    value={stats.pipelineCount}
                    icon={Activity}
                    trend="1.2"
                    trendUp={true}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Running Containers"
                    value={stats.containerCount}
                    icon={Box}
                    trend="0.5"
                    trendUp={false}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Build Success Rate"
                    value={`${stats.buildSuccessRate}%`}
                    icon={CheckCircle2}
                    trend="4.0"
                    trendUp={true}
                    color="bg-green-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Builds */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Builds</h3>
                        <button className="text-sm text-blue-500 hover:text-blue-400">View All</button>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentBuilds.length > 0 ? (
                            recentBuilds.map((build, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {build.status === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
                                        {build.status === 'failed' && <XCircle className="text-red-500" size={20} />}
                                        {build.status === 'running' && <Activity className="text-yellow-500 animate-pulse" size={20} />}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{build.name}</p>
                                            <p className="text-xs text-gray-500">{build.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 font-mono">{build.duration}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {loading ? 'Loading builds...' : 'No recent builds available'}
                            </div>
                        )}
                    </div>
                </div>

                {/* GitHub Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">GitHub Activity</h3>
                        <button className="text-sm text-blue-500 hover:text-blue-400">View All</button>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {githubActivity.length > 0 ? (
                            githubActivity.map((activity, i) => (
                                <div key={i} className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                                        {activity.user.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            <span className="font-medium">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.repo} • {activity.time}</p>
                                    </div>
                                    <GitCommit size={16} className="text-gray-400" />
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {loading ? 'Loading activity...' : 'No recent activity available'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
