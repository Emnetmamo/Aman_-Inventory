// server.js (or your main server file)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes'); // Import raw material routes
const productCategoryRoutes = require('./routes/productCategoryRoutes'); // Import product category routes
const productRoutes = require('./routes/productRoutes');
const InventoryrawMaterialRoutes = require("./routes/InventoryrawMaterialRoutes");
const semiFinishedProductRoutes = require("./routes/SemiFinishedProductRoutes");
const FinishedProductRoutes = require("./routes/finishedProductRoutes");
const CustomerRoutes = require("./routes/CustomerRoutes");
const OrderRoutes = require('./routes/OrderRoutes');

const app = express();
app.use(
  cors({
    origin: "https://aman-inventory-frontend.vercel.app", // Replace wth front end api
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, this is your server running on Vercel!");
});

app.use(express.json()); // Parse JSON

// MongoDB connection
mongoose
  .connect("mongodb+srv://Aman:Aman%401234@cluster0.ck2wo.mongodb.net/Aman'sInventoryDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection failed:', error));

// Use the raw material routes
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory/raw-materials', InventoryrawMaterialRoutes);
app.use('/api/inventory/semiFinishedProduct', semiFinishedProductRoutes);
app.use('/api/inventory/finishedProduct', FinishedProductRoutes); 
app.use('/api/sales/customer', CustomerRoutes); 
app.use('/api/sales/order', OrderRoutes); 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
