import React from 'react';
import {
    Github,
    Terminal,
    Container,
    Save,
    Moon,
    Sun,
    Shield,
    Key
} from 'lucide-react';

const SettingsSection = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const ConnectionCard = ({ icon: Icon, title, description, connected, color }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${connected
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90'
                }`}
        >
            {connected ? 'Connected' : 'Connect'}
        </button>
    </div>
);

const SettingsTab = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your integrations and preferences.</p>
            </div>

            <SettingsSection title="Integrations">
                <div className="space-y-4">
                    <ConnectionCard
                        icon={Github}
                        title="GitHub"
                        description="Connect repositories and sync workflows"
                        connected={true}
                        color="bg-gray-800"
                    />
                    <ConnectionCard
                        icon={Terminal}
                        title="Jenkins"
                        description="Connect CI/CD pipelines"
                        connected={true}
                        color="bg-orange-500"
                    />
                    <ConnectionCard
                        icon={Container}
                        title="Docker"
                        description="Connect local Docker daemon"
                        connected={false}
                        color="bg-blue-500"
                    />
                </div>
            </SettingsSection>

            <SettingsSection title="Appearance">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                            <p className="text-sm text-gray-500">Toggle application theme</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </SettingsSection>

            <SettingsSection title="Security">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Key size={20} className="text-gray-500" />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">API Keys</h4>
                                <p className="text-sm text-gray-500">Manage your personal access tokens</p>
                            </div>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">Manage</button>
                    </div>
                </div>
            </SettingsSection>

            <div className="flex justify-end gap-3">
                <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
