const express = require('express');
const router = express.Router();
const InventoryrawMaterialController = require('../controllers/InventoryrawMaterialController');

// Route to update raw material quantity
router.put('/:materialId', InventoryrawMaterialController.updateRawMaterialQuantity);

module.exports = router;
