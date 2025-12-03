import express from 'express';
import { getRepos, syncRepos } from '../controllers/githubController.js';
import { getPipelines, triggerBuild, getBuildLogs } from '../controllers/jenkinsController.js';
import { getContainers, controlContainer, getContainerLogs } from '../controllers/dockerController.js';

const router = express.Router();

// GitHub Routes
router.get('/github/repos', getRepos);
router.post('/github/sync', syncRepos);

// Jenkins Routes
router.get('/jenkins/pipelines', getPipelines);
router.post('/jenkins/build/:name', triggerBuild);
router.get('/jenkins/logs/:name', getBuildLogs);

// Docker Routes
router.get('/docker/containers', getContainers);
router.post('/docker/container/:id', controlContainer);
router.get('/docker/logs/:id', getContainerLogs);

import { getStats } from '../controllers/statsController.js';

// ... existing imports

// Stats Route
router.get('/stats', getStats);

export default router;
