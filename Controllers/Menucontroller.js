const MenuItem = require('../models/Menuitem');

// @desc    Get menu items (optional filter by stallId: /api/menu?stallId=xxx)
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const filter = req.query.stallId ? { stallId: req.query.stallId } : {};
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add a new menu item
// @route   POST /api/menu/add
exports.addMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update menu item by ID
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};