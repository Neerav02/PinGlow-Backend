const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrGetChat, getUserChats } = require('../controller/chatController');

router.post('/create', protect, createOrGetChat);
router.get('/', protect, getUserChats);

module.exports = router;
