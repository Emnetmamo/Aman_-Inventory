const FinishedProduct = require("../models/FinishedProduct");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");

module.exports = {
  // Fetch all product categories
  getCategories: async (req, res) => {
    try {
      const categories = await ProductCategory.find({});
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch categories." });
    }
  },

  // Fetch products by category ID
  getProductsByCategory: async (req, res) => {
    try {
      const products = await Product.find({ category: req.params.categoryId });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products." });
    }
  },

  // Add a new finished product or update an existing one
  addFinishedProduct: async (req, res) => {
    const { category, product, quantity, manufacturingDate } = req.body;

    try {
      const existingProduct = await FinishedProduct.findOne({ product });

      if (existingProduct) {
        // Add to batch if product exists
        existingProduct.batch.push({ quantity, date: manufacturingDate });
        existingProduct.totalQuantity += quantity;
        await existingProduct.save();
        return res
          .status(200)
          .json({ message: "Batch added to existing finished product." });
      }

      // Create a new finished product
      const newProduct = new FinishedProduct({
        category,
        product,
        batch: [{ quantity, date: manufacturingDate }],
        totalQuantity: quantity,
      });
      await newProduct.save();

      res.status(201).json({ message: "Finished product added successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add finished product." });
    }
  },

  // Fetch all finished products
  getFinishedProducts: async (req, res) => {
    try {
      const products = await FinishedProduct.find({})
        .populate("category", "name")
        .populate("product", "name code");
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch finished products." });
    }
  },
};
