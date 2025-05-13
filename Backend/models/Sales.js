import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
      },
      cardNumber: {
        type: String,
        required: [true, "Card number is required"],
        minlength: [13, "Card number must be at least 13 digits"],
        maxlength: [19, "Card number must be at most 19 digits"],
      },
      totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
      },
    },
    saleDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
