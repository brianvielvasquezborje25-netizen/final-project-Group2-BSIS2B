const express = require('express');
const router = express.Router();
const { loginUser } = require('../Controllers/Authcontroller');

// Route mapping
router.post('/login', loginUser);

module.exports = router;