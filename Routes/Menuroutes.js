const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem
} = require('../Controllers/Menucontroller');

// Route definitions
router.get('/', getMenuItems);
router.post('/add', addMenuItem);
router.put('/:id', updateMenuItem);

module.exports = router;