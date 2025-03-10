const SemiFinishedProduct = require('../models/SemiFinishedProduct');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const FinishedProduct = require('../models/FinishedProduct');

// Fetch all semi-finished products
exports.getAllSemiFinishedProducts = async (req, res) => {
    try {
      const products = await SemiFinishedProduct.find()
        .populate('category', 'name code')
        .populate('product', 'name code');
      
      if (!products) {
        return res.status(404).json({ error: 'No products found' });
      }
      res.status(200).json(products);
    } catch (err) {
      console.error("Error fetching semi-finished products:", err); // More detailed error log
      res.status(500).json({ error: 'Failed to fetch semi-finished products' });
    }
  };
  

// Fetch categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({}, 'name');
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Fetch products by category
// Example: Ensure to select both name and code
// Example: Ensure to select both name and code
exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        // Query for products and select only the 'name' and 'code' fields
        const products = await Product.find({ category: categoryId }).select('name code');
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for this category' });
        }

        console.log(products); // Log products to check if 'name' and 'code' are included
        res.status(200).json(products); // Send the data to the frontend
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

  
  


// Add a semi-finished product
exports.addSemiFinishedProduct = async (req, res) => {
  const { category, product, stage, quantity } = req.body;

  try {
    // Create and save semi-finished product
    const newProduct = new SemiFinishedProduct({ category, product, stage, quantity });
    const savedProduct = await newProduct.save();

    // Check if the product's stage is finished
    if (stage.name === 'Finished') {
      // Check if the product already exists in Finished Products
      const existingFinishedProduct = await FinishedProduct.findOne({ product: product });

      if (existingFinishedProduct) {
        // Add the batch and update the total quantity
        existingFinishedProduct.batch.push({
          quantity,
          date: new Date(),
        });
        existingFinishedProduct.totalQuantity += quantity;
        await existingFinishedProduct.save();
      } else {
        // Create a new FinishedProduct model if not exists
        const newFinishedProduct = new FinishedProduct({
          product,
          category,
          batch: [{ quantity, date: new Date() }],
          totalQuantity: quantity,
        });
        await newFinishedProduct.save();
      }
    }

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add semi-finished product' });
  }
};

// Update the stage of a semi-finished product
exports.updateStage = async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  try {
    // Update the semi-finished product stage
    const updatedProduct = await SemiFinishedProduct.findByIdAndUpdate(
      id,
      { $set: { stage: { ...stage, date: new Date() } } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If the new stage is "Finished", add to Finished Products
    if (stage.name === 'Finished') {
      const existingFinishedProduct = await FinishedProduct.findOne({ product: updatedProduct.product });

      if (existingFinishedProduct) {
        // Add the batch and update total quantity
        existingFinishedProduct.batch.push({
          quantity: updatedProduct.quantity,
          date: new Date(),
        });
        existingFinishedProduct.totalQuantity += updatedProduct.quantity;
        await existingFinishedProduct.save();
      } else {
        // Create new finished product if not exists
        const newFinishedProduct = new FinishedProduct({
          product: updatedProduct.product,
          category: updatedProduct.category,
          batch: [{ quantity: updatedProduct.quantity, date: new Date() }],
          totalQuantity: updatedProduct.quantity,
        });
        await newFinishedProduct.save();
      }
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product stage' });
  }
};
