import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    customerName: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
