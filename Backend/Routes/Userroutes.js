
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require('../Controllers/Usercontroller');

// Route mapping
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/password', updatePassword);

module.exports = router;
