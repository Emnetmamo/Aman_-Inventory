const express = require('express');
const router = express.Router();
const semiFinishedProductController = require('../controllers/SemiFinishedProduct Controller');

// Get all semi-finished products
router.get('/', semiFinishedProductController.getAllSemiFinishedProducts);

// Get categories
router.get('/categories', semiFinishedProductController.getCategories);

// Get products by category
router.get('/products/:categoryId', semiFinishedProductController.getProductsByCategory);

// Add a semi-finished product
router.post('/', semiFinishedProductController.addSemiFinishedProduct);

// Update product stage
router.put('/:id', semiFinishedProductController.updateStage);

module.exports = router;
