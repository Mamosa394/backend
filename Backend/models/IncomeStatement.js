// models/IncomeStatement.js
import mongoose from "mongoose";

const incomeStatementSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  month: { type: String, required: true },
  revenue: { type: Number, default: 0 },
  costOfGoodsSold: { type: Number, default: 0 },
  operatingExpenses: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  additionalCategories: [
    {
      label: { type: String, required: true },
      amount: { type: Number, default: 0 },
    },
  ],
});

const IncomeStatement = mongoose.model(
  "IncomeStatement",
  incomeStatementSchema
);

export default IncomeStatement;
