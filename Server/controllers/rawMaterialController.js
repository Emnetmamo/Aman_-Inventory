// controllers/rawMaterialController.js
const RawMaterial = require('../models/RawMaterial');

// Get all raw materials
exports.getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find();
    res.json(rawMaterials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRawMaterial = async (req, res) => {
  const { name, price } = req.body;

  // Validation for required fields
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required." });
  }

  try {
    // Check if the material already exists (case-insensitive)
    const existingMaterial = await RawMaterial.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (existingMaterial) {
      return res.status(400).json({ message: "Raw material already exists." });
    }

    // Generate new code
    const latestMaterial = await RawMaterial.findOne().sort({ _id: -1 });
    const newCode = latestMaterial && latestMaterial.code 
      ? `R${parseInt(latestMaterial.code.slice(1)) + 1}` 
      : 'R1';

    // Save the new material
    const newMaterial = new RawMaterial({ name, price, code: newCode });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Update an existing raw material
exports.updateRawMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      { name, price },
      { new: true }
    );
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a raw material
exports.deleteRawMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    await RawMaterial.findByIdAndDelete(id);
    res.json({ message: 'Raw material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addOrUpdateRawMaterial = async (req, res) => {
  const { name, price, quantity, purchaseDate } = req.body;

  try {
    // Look for the raw material by its name
    let rawMaterial = await RawMaterial.findOne({ name });

    if (rawMaterial) {
      // If the material exists, update its quantity and add purchase details
      const newQuantity = rawMaterial.quantityInStock + quantity;
      rawMaterial.quantityInStock = newQuantity;
      rawMaterial.purchases.push({ quantity, purchaseDate });

      // Save the updated raw material
      await rawMaterial.save();

      return res.status(200).json({ message: "Raw material updated successfully", rawMaterial });
    } else {
      // If the material doesn't exist, create a new one
      const newRawMaterial = new RawMaterial({
        name,
        price,
        quantityInStock: quantity,  // Set initial quantity
        purchases: [{ quantity, purchaseDate }],  // Initialize with the first purchase
      });

      // Save the new raw material
      await newRawMaterial.save();

      return res.status(201).json({ message: "Raw material added successfully", rawMaterial: newRawMaterial });
    }
  } catch (error) {
    console.error("Error while adding/updating raw material:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
