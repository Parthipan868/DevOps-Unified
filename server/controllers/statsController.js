import Repository from '../models/Repository.js';
import Pipeline from '../models/Pipeline.js';
import Container from '../models/Container.js';

export const getStats = async (req, res) => {
    try {
        const repoCount = await Repository.countDocuments();
        const pipelineCount = await Pipeline.countDocuments();
        const containerCount = await Container.countDocuments({ state: 'running' });

        // Mock build success rate for now
        const buildSuccessRate = 94;

        res.json({
            repoCount,
            pipelineCount,
            containerCount,
            buildSuccessRate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
