const Customer = require('../models/Customer');

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const { customerName, phoneNumber, address, email, tinNumber } = req.body;

        // Validate request
        if (!customerName || !phoneNumber || !address || !tinNumber) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Create customer
        const newCustomer = new Customer({
            customerName,
            phoneNumber,
            address,
            email,
            tinNumber
        });

        // Save customer to the database
        await newCustomer.save();

        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

module.exports = { createCustomer };
