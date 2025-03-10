// routes/productCategoryRoutes.js
const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

// Routes
router.post('/', productCategoryController.createProductCategory); // Create new product category
router.get('/', productCategoryController.getProductCategories); // Get all product categories

module.exports = router;
