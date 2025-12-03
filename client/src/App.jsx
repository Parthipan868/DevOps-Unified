import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import GitHubTab from './pages/GitHubTab';
import JenkinsTab from './pages/JenkinsTab';
import DockerTab from './pages/DockerTab';
import AnalyticsTab from './pages/AnalyticsTab';
import SettingsTab from './pages/SettingsTab';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="github" element={<GitHubTab />} />
          <Route path="jenkins" element={<JenkinsTab />} />
          <Route path="docker" element={<DockerTab />} />
          <Route path="analytics" element={<AnalyticsTab />} />
          <Route path="settings" element={<SettingsTab />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
