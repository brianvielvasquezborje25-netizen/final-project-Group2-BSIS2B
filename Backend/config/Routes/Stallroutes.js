const express = require('express');
const router = express.Router();
const Stall = require('../../Models/Stall');
const MenuItem = require('../../Models/Menuitem');

router.get('/', async (req, res) => {
  try {
    const stalls = await Stall.find().populate('ownerId', 'name email');
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/menu', async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found' });

    const menuItems = await MenuItem.find({ stallId: req.params.id });
    res.json({ stall, menu: menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const stall = new Stall(req.body);
    await stall.save();
    res.status(201).json(stall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/status', async (req, res) => {
  try {
    const { stallId, isOpen } = req.body;
    const stall = await Stall.findByIdAndUpdate(
      stallId,
      { isOpen },
      { new: true }
    );
    res.json(stall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;