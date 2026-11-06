const express = require('express');
const router = express.Router();
const {
  getAllStalls,
  createStall,
  updateStall,
  deleteStall
} = require('../Controllers/Stallcontroller');

// Route mapping
router.get('/', getAllStalls);
router.post('/', createStall);
router.put('/:id', updateStall);
router.delete('/:id', deleteStall);

module.exports = router;