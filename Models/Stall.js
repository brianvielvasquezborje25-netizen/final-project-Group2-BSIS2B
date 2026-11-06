const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stallName: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true
  },
  operatingHours: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  gcashAvailable: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Stall', stallSchema);