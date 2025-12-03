import express from 'express';
import { getRepos, syncRepos, getRecentActivity } from '../controllers/githubController.js';
import { getPipelines, triggerBuild, getBuildLogs, getRecentBuilds } from '../controllers/jenkinsController.js';
import { getContainers, controlContainer, getContainerLogs } from '../controllers/dockerController.js';

const router = express.Router();

// GitHub Routes
router.get('/github/repos', getRepos);
router.post('/github/sync', syncRepos);
router.get('/github/activity', getRecentActivity);

// Jenkins Routes
router.get('/jenkins/pipelines', getPipelines);
router.post('/jenkins/build/:name', triggerBuild);
router.get('/jenkins/logs/:name', getBuildLogs);
router.get('/jenkins/recent-builds', getRecentBuilds);

// Docker Routes
router.get('/docker/containers', getContainers);
router.post('/docker/container/:id', controlContainer);
router.get('/docker/logs/:id', getContainerLogs);

import { getStats } from '../controllers/statsController.js';

// ... existing imports

// Stats Route
router.get('/stats', getStats);

export default router;
