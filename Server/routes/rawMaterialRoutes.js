// routes/rawMaterialRoutes.js
const express = require('express');
const {
  getAllRawMaterials,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  addOrUpdateRawMaterial
} = require('../controllers/rawMaterialController');

const router = express.Router();

router.get('/', getAllRawMaterials); // Get all raw materials
router.post('/', addRawMaterial); // Add a new raw material
router.put('/:id', updateRawMaterial); // Update raw material
router.delete('/:id', deleteRawMaterial); // Delete raw material


router.post('/raw-materials', addOrUpdateRawMaterial);

module.exports = router;
