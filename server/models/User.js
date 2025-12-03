import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    avatarUrl: String,
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'dark'
        }
    },
    favorites: {
        repos: [{ type: String }], // Store repo IDs or full names
        pipelines: [{ type: String }], // Store pipeline names
        containers: [{ type: String }] // Store container names
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
