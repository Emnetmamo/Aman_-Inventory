const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  weight: { type: Number, required: true },
  rawMaterialCost: { type: Number, required: true },
  packaging: { type: Number, required: true },
  label: { type: Number, required: true },
  film: { type: Number, required: true },
  carton: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  profit: { type: Number, default: 0 }, // New field for Profit
  profitMargin: { type: Number, default: 0 }, // Profit margin as a percentage
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('Product', productSchema);
