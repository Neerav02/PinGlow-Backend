const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controller/messageController');

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);

module.exports = router;
