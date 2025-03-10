// controllers/productCategoryController.js
const ProductCategory = require('../models/ProductCategory');
const RawMaterial = require('../models/RawMaterial');

// Create a new product category
exports.createProductCategory = async (req, res) => {
  try {
    const { id, name, rawMaterials } = req.body;
    
    // Calculate total cost
    const totalCost = rawMaterials.reduce((total, material) => total + material.costPerKg, 0);

    const newCategory = new ProductCategory({
      id,
      name,
      rawMaterials,
      totalCost,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all product categories
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

