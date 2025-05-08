import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
