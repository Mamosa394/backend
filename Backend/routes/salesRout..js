import express from "express";
import Sale from "../models/salesModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { productId, name, price, buyer, phone, paymentMethod } = req.body;

    const sale = new Sale({
      productId,
      name,
      price,
      buyer,
      phone,
      paymentMethod,
    });
    await sale.save();
    res.status(201).json({ message: "Sale recorded successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to record sale." });
  }
});

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales." });
  }
});

export default router;
