import mongoose from 'mongoose';

const pipelineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    url: String,
    lastBuild: {
        number: Number,
        status: String,
        timestamp: Date,
        duration: Number,
        url: String
    },
    health: Number
}, { timestamps: true });

export default mongoose.model('Pipeline', pipelineSchema);
