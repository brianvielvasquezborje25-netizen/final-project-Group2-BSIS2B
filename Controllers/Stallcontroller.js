const Stall = require('../Models/Stall');

// @desc    Get all campus stalls
// @route   GET /api/stalls
exports.getAllStalls = async (req, res) => {
  try {
    const stalls = await Stall.find();
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new stall
// @route   POST /api/stalls
exports.createStall = async (req, res) => {
  try {
    const stall = new Stall(req.body);
    await stall.save();
    res.status(201).json(stall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a stall by ID (e.g., status, info)
// @route   PUT /api/stalls/:id
exports.updateStall = async (req, res) => {
  try {
    const updatedStall = await Stall.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStall) {
      return res.status(404).json({ message: 'Stall not found' });
    }
    res.json(updatedStall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a stall by ID
// @route   DELETE /api/stalls/:id
exports.deleteStall = async (req, res) => {
  try {
    const deletedStall = await Stall.findByIdAndDelete(req.params.id);
    if (!deletedStall) {
      return res.status(404).json({ message: 'Stall not found' });
    }
    res.json({ message: 'Stall successfully deleted', stall: deletedStall });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};