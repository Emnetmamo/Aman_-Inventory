const express = require('express');
const { createCustomer } = require('../controllers/CustomerController');
const router = express.Router();

// Route for creating a customer
router.post('/register', createCustomer);

module.exports = router;
