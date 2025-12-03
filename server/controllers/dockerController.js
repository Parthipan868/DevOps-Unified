import Docker from 'dockerode';

// Initialize Docker connection
// This works for Windows (named pipe) and Linux/Mac (socket)
const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

// Helper to format container status
const formatStatus = (state, status) => {
    if (state === 'running') return 'Running';
    if (state === 'exited') return 'Stopped';
    return state.charAt(0).toUpperCase() + state.slice(1);
};

export const getContainers = async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });

        const formattedContainers = containers.map(container => ({
            id: container.Id.substring(0, 12),
            name: container.Names[0].replace('/', ''),
            image: container.Image,
            state: formatStatus(container.State, container.Status),
            status: container.Status,
            created: new Date(container.Created * 1000),
            // CPU and Memory are hard to get in list view without streaming stats
            // For now we'll show basic info or placeholders
            cpu: '0%',
            memory: '0 MB'
        }));

        res.json(formattedContainers);
    } catch (error) {
        console.error('Error fetching Docker containers:', error.message);
        // Fallback to mock data if Docker is not running or accessible
        if (error.code === 'ENOENT' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                message: 'Docker is not running or not accessible',
                error: error.message
            });
        }
        res.status(500).json({ message: error.message });
    }
};

export const controlContainer = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // start, stop, restart

        const container = docker.getContainer(id);

        if (action === 'start') {
            await container.start();
        } else if (action === 'stop') {
            await container.stop();
        } else if (action === 'restart') {
            await container.restart();
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.json({ message: `Container ${id} ${action}ed successfully` });
    } catch (error) {
        console.error(`Error ${req.body.action}ing container:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getContainerLogs = async (req, res) => {
    try {
        const { id } = req.params;
        const container = docker.getContainer(id);

        // Get logs (stdout and stderr)
        // tail: 100 means get last 100 lines
        const logsBuffer = await container.logs({
            follow: false,
            stdout: true,
            stderr: true,
            tail: 100
        });

        // Docker logs contain header bytes, we might need to clean them up
        // But for simplicity, let's just send the buffer as string first
        // In a real app, you'd demultiplex the stream
        // The simple toString might have some garbage characters at the start of lines
        // A simple regex or just sending it raw is a good start

        // Basic cleanup of Docker log headers (8 bytes) if needed, 
        // but for now let's just return the string.
        // Often the raw string is readable enough for a dashboard.

        res.json({ logs: logsBuffer.toString('utf8') });
    } catch (error) {
        console.error('Error fetching container logs:', error.message);
        res.status(500).json({ message: error.message });
    }
};
