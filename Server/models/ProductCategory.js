// models/ProductCategory.js
const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // 2-digit ID
    name: { type: String, required: true },
    rawMaterials: [
      {
        rawMaterial: { type: String, required: true },
        weightPercent: { type: Number, required: true },
        costPerKg: { type: Number, default: 0 },
      },
    ],
    totalCost: { type: Number, default: 0 },
  },
  { timestamps: true } // Enable createdAt and updatedAt fields
);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
