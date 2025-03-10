const mongoose = require('mongoose');

// Define a schema for a single purchase record
const purchaseSchema = new mongoose.Schema({
  quantity: { type: Number, default: null },
  purchaseDate: { type: Date, default: null },
});

// Define the main RawMaterial schema
const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, unique: true, required: true }, // Unique code field
  purchases: [purchaseSchema],
  quantityInStock: { type: Number, default: 0 },
});

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

module.exports = RawMaterial;
