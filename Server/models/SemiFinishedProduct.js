const mongoose = require('mongoose');

const SemiFinishedProductSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  stage: {
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('SemiFinishedProduct', SemiFinishedProductSchema);
