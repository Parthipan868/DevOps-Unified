import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fullName: { type: String, required: true, unique: true },
    description: String,
    url: String,
    language: String,
    stars: Number,
    forks: Number,
    openIssues: Number,
    owner: {
        login: String,
        avatarUrl: String
    },
    lastUpdated: Date
}, { timestamps: true });

export default mongoose.model('Repository', repoSchema);
