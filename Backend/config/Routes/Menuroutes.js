const express = require('express');
const router = express.Router();
const MenuItem = require('../../Models/Menuitem');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.stallId ? { stallId: req.query.stallId } : {};
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;