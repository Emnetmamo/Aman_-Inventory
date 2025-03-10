const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,  // Optional
    },
    tinNumber: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
