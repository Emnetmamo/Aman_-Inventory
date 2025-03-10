// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route to add a product
router.post('/add', productController.addProduct);

// Route to get all products
router.get('/', productController.getProducts);

module.exports = router;
