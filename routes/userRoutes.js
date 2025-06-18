const express = require('express');
const router = express.Router();
const { getUsers, updateProfile } = require('../controller/userController');
const auth = require('../middleware/auth');

router.get('/', auth, getUsers);
router.put('/profile', auth, updateProfile);

module.exports = router; 