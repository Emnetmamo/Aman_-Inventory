const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

// Helper function to calculate profit margin
const calculateProfitMargin = (sellingPrice, totalCost) => {
  return sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0;
};

// Add a new product
exports.addProduct = async (req, res) => {
  const {
    name,
    category, // This should be the ObjectId of the category
    weight,
    rawMaterialCost,
    packaging,
    label,
    film,
    carton,
    sellingPrice,
  } = req.body;

  try {
    // Check if all required fields are provided
    if (!name || !category || !weight || !sellingPrice) {
      return res.status(400).json({ message: 'Name, category, weight, and selling price are required' });
    }

    // Fetch category details to create the product code
    const productCategory = await ProductCategory.findById(category);
    if (!productCategory) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Generate product code: 2-digit category ID + sequential product number
    const productsInCategory = await Product.countDocuments({ category: category });
    const code = `${String(productCategory.id).padStart(2, '0')}${String(productsInCategory + 1).padStart(1, '0')}`;

    // Calculate total cost
    const calculatedTotalCost =
      Number(rawMaterialCost) + Number(packaging) + Number(label) + Number(film) + Number(carton);

    // Calculate profit and profit margin
    const profit = sellingPrice - calculatedTotalCost;
    const profitMargin = calculateProfitMargin(sellingPrice, calculatedTotalCost);

    // Create new product
    const newProduct = new Product({
      code,
      name,
      category, // Use the category ObjectId directly
      weight,
      rawMaterialCost,
      packaging,
      label,
      film,
      carton,
      sellingPrice,
      totalCost: calculatedTotalCost,
      profit, // Include profit
      profitMargin, // Include profit margin
    });

    // Save product to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};
