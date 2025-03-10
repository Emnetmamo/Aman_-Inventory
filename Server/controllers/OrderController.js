const Order = require('../models/Order');
const Customer = require('../models/Customer');
const FinishedProduct = require('../models/FinishedProduct');

// Fetch customers for dropdown
const fetchCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({}, 'customerName tinNumber');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};


// Function to place an order
const placeOrder = async (req, res) => {
  console.log('Received request to place order:', req.body);
  try {
    const { customer, products, date } = req.body;
    console.log('Processing order for customer:', customer);
    console.log('Products:', products);

    // Loop through each product in the order
    for (const product of products) {
      const finishedProduct = await FinishedProduct.findById(product.product);  // Use ObjectId
      if (!finishedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get the total available quantity in stock
      let totalAvailable = finishedProduct.totalQuantity;

      // Check pending orders for this product
      const pendingOrders = await Order.find({
        'products.product': product.product,
        'products.status': 'Pending'
      });

      // Subtract pending orders from available stock (or any further logic here)
      totalAvailable -= pendingOrders.reduce((total, order) => {
        return total + order.products.filter(p => p.product.toString() === product.product.toString()).reduce((sum, p) => sum + p.quantity, 0);
      }, 0);

      // Now, you can handle the stock validation, like checking if the requested quantity is available
      if (product.quantity > totalAvailable) {
        return res.status(400).json({ message: `Not enough stock for product ${product.product}` });
      }

      // Process the order (you can now proceed to update the stock and save the order)
    }

    // Save the order and respond
    const order = new Order({ customer, products, date });
    await order.save();
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { fetchCustomers, placeOrder}



// // Function to get the available stock for a product
// const getAvailableStock = async (req, res) => {
//     console.log('Route hit for product ID:', req.params.productId);  // Add this line to debug
//     try {
//         const productId = req.params.productId;
//         // rest of the code...
//     } catch (error) {
//         console.error(error); // Improved error logging for debugging
//         res.status(500).json({ message: 'Error fetching product stock', error: error.message });
//     }
// };

  
//   // Function to get all pending orders for a product
//   const getPendingOrders = async (req, res) => {
//     try {
//       // Fetch all pending orders with product details populated
//       const pendingOrders = await Order.find({ status: 'pending' }).populate('products.productId');
//       res.json(pendingOrders);
//     } catch (err) {
//       console.error(err); // More robust error logging
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
  
//   // Function to create a new order
// const createOrder = async (req, res) => {
//     try {
//       const { customer, products, date } = req.body;
  
//       // Create new order object
//       const newOrder = new Order({
//         customer,
//         products,
//         date,
//         status: 'pending' // Default status is pending
//       });
  
//       await newOrder.save();
//       res.status(201).json(newOrder);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error placing order' });
//     }
//   };

// module.exports = { fetchCustomers, getPendingOrders, getAvailableStock ,createOrder };

