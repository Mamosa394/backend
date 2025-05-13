import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  buyer: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["Mpesa", "EcoCash", "Pay Pearl"],
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
