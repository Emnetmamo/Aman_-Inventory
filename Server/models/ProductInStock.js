const mongoose = require('mongoose');

// Product In Stock schema
const productInStockSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  currentQuantity: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  batchProduced: [
    {
      quantity: { type: Number, required: true },
      dateOfManufacturing: { type: Date, required: true }
    }
  ]
});

// Model for ProductInStock
const ProductInStock = mongoose.model('ProductInStock', productInStockSchema);

module.exports = ProductInStock;
