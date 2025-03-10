const mongoose = require("mongoose");

const FinishedProductSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  batch: [
    {
      quantity: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  totalQuantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("FinishedProduct", FinishedProductSchema);