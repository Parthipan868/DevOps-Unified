import mongoose from 'mongoose';

const containerSchema = new mongoose.Schema({
    containerId: { type: String, required: true, unique: true },
    name: String,
    image: String,
    state: String,
    status: String,
    ports: [{
        privatePort: Number,
        publicPort: Number,
        type: String
    }],
    created: Date
}, { timestamps: true });

export default mongoose.model('Container', containerSchema);
