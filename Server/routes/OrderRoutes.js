const express = require('express');
// const { fetchCustomers, createOrder , fetchOrder, getFinishedProducts, getPendingOrders,getFinishedProductDetails} = require('../controllers/OrderController');
const orderController = require('../controllers/OrderController');
const router = express.Router();

// Fetch customers for dropdown
router.get('/customers', orderController.fetchCustomers);

// Route to place an order
router.post('/', orderController.placeOrder);

module.exports = router;





// // Route for fetching available stock for a product
// router.get('/:productId/stock', orderController.getAvailableStock);

// // Route for fetching pending orders
// router.get('/pending', orderController.getPendingOrders);

// // Route for placing a new order
// router.post('/', orderController.createOrder);
