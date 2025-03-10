const express = require("express");
const router = express.Router();
const finishedProductController = require("../controllers/finishedProductController");

// Route to get all categories
router.get("/categories", finishedProductController.getCategories);

// Route to get products by category ID
router.get("/products/:categoryId", finishedProductController.getProductsByCategory);

// Route to add a new finished product
router.post("/", finishedProductController.addFinishedProduct);

// Route to get all finished products
router.get("/", finishedProductController.getFinishedProducts);

module.exports = router;
