import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Calendar, Filter } from 'lucide-react';

const AnalyticsTab = () => {
    const commitData = [
        { name: 'Mon', commits: 4 },
        { name: 'Tue', commits: 7 },
        { name: 'Wed', commits: 12 },
        { name: 'Thu', commits: 5 },
        { name: 'Fri', commits: 9 },
        { name: 'Sat', commits: 2 },
        { name: 'Sun', commits: 1 },
    ];

    const buildData = [
        { name: 'Mon', success: 10, failed: 2 },
        { name: 'Tue', success: 15, failed: 1 },
        { name: 'Wed', success: 8, failed: 4 },
        { name: 'Thu', success: 12, failed: 0 },
        { name: 'Fri', success: 20, failed: 3 },
        { name: 'Sat', success: 5, failed: 1 },
        { name: 'Sun', success: 2, failed: 0 },
    ];

    const containerData = [
        { name: 'Running', value: 5 },
        { name: 'Stopped', value: 3 },
        { name: 'Paused', value: 1 },
    ];

    const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Insights into your DevOps performance.</p>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Calendar size={16} />
                        Last 7 Days
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commits Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Commit Activity</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={commitData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Build Status Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Build Success Rate</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={buildData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} />
                                <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Container Status Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Container Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={containerData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {containerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                        <h4 className="text-blue-100 font-medium mb-2">Total Commits (Week)</h4>
                        <p className="text-4xl font-bold">40</p>
                        <p className="text-blue-100 text-sm mt-2">+12% from last week</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                        <h4 className="text-green-100 font-medium mb-2">Success Rate</h4>
                        <p className="text-4xl font-bold">92.5%</p>
                        <p className="text-green-100 text-sm mt-2">+5% improvement</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
