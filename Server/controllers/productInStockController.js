const ProductInStock = require('../models/ProductInStock');
const Product = require('../models/Product'); // Assuming you have a Product model

// Controller to add a manufactured product
exports.addManufacturedProduct = async (req, res) => {
  const { productId, quantity, dateOfManufacturing } = req.body;

  try {
    // Find the ProductInStock entry for the selected product
    let productInStock = await ProductInStock.findOne({ product: productId });

    if (!productInStock) {
      // If product doesn't exist in stock, create a new entry
      productInStock = new ProductInStock({
        product: productId,
        currentQuantity: quantity,
        batchProduced: [{ quantity, dateOfManufacturing }]
      });
    } else {
      // If it exists, update current quantity and add the batch
      productInStock.currentQuantity += quantity;
      productInStock.batchProduced.push({ quantity, dateOfManufacturing });
    }

    // Save the updated productInStock
    await productInStock.save();
    return res.status(200).json({ message: 'Product manufactured and added to stock', productInStock });
  } catch (error) {
    console.error('Error adding manufactured product:', error);
    return res.status(500).json({ error: 'Error adding manufactured product' });
  }
};
