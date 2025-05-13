// routes/sales.js
import express from "express";
import Sale from "../models/Sales.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * @route GET /api/sales
 * @description Get all sales
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate("productId", "name price");
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /api/sales/:id
 * @description Get a specific sale by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "productId",
      "name price"
    );
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route PUT /api/sales/:id
 * @description Update an existing sale
 * @access Public
 */
router.put("/:id", async (req, res) => {
  try {
    const { productId, paymentDetails } = req.body;

    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.paymentMethod) {
      return res.status(400).json({ error: "Incomplete payment details" });
    }

    // Find and update the sale record
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      { productId, paymentDetails },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.status(200).json(updatedSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route DELETE /api/sales/:id
 * @description Delete a sale record
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... all your existing routes here ...

/**
 * @route POST /api/sales
 * @description Record a new sale
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const { productId, paymentDetails } = req.body;

    if (
      !productId ||
      !paymentDetails?.paymentMethod ||
      !paymentDetails?.cardNumber ||
      typeof paymentDetails.totalAmount !== "number"
    ) {
      return res.status(400).json({ error: "Missing required sale fields" });
    }

    // Optional: Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const sale = new Sale({
      productId,
      paymentDetails,
    });

    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
