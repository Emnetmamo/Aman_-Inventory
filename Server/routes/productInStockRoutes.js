const express = require('express');
const router = express.Router();
const productInStockController = require('../controllers/productInStockController');

// Route to add manufactured product
router.post('/add-manufactured-product', productInStockController.addManufacturedProduct);

module.exports = router;
