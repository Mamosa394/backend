import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    salesperson: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "completed", // Default status
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "mpesa", "ecocash"],
      required: true,
    },
    saleType: {
      type: String,
      enum: ["online", "in-store"],
      required: true,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sales", salesSchema);

export default Sales;
