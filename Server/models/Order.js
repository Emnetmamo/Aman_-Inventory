const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    products: [
        {
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FinishedProduct',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                default: 'Pending', // Default value for each product status
            },
        }
    ],
    status: {
        type: String,
        default: 'Pending', // Default value for the overall order status
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
