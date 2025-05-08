import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Desktop", "Laptop", "Server"],
      required: true,
    },
    specs: {
      cpu: { type: String, required: true },
      ram: { type: String, required: true },
      storage: { type: String, required: true },
      gpu: { type: String },
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Recycled", "Reserved"],
      default: "Available",
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
