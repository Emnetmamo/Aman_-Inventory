const RawMaterial = require('../models/RawMaterial');

// Function to update the raw material's quantity and total quantity in stock
exports.updateRawMaterialQuantity = async (req, res) => {
  const { materialId } = req.params; // The materialId from the URL parameter
  const { quantity, date } = req.body; // The quantity and date from the request body

  try {
    // Find the raw material by ID
    const material = await RawMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    // Add the new purchase to the purchases array
    material.purchases.push({ quantity, purchaseDate: date });

    // Calculate the total quantity in stock
    const totalQuantity = material.purchases.reduce((total, purchase) => total + purchase.quantity, 0);

    // Update the quantityInStock field with the new total
    material.quantityInStock = totalQuantity;

    // Save the updated raw material
    await material.save();

    return res.status(200).json({ message: 'Raw material updated successfully', material });
  } catch (error) {
    console.error('Error updating raw material:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
