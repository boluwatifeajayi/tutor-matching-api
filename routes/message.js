const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const studentAuthMiddleware = require('../middleware/authMiddleware');
const tutorAuthMiddleware = require('../middleware/tutorMiddleware');

const router = express.Router();

// Route to send a message
router.post('/send', studentAuthMiddleware, sendMessage);
router.post('/send', tutorAuthMiddleware, sendMessage);

// Route to get all messages for a user
router.get('/student/all', studentAuthMiddleware, getMessages);
router.get('/all', tutorAuthMiddleware, getMessages);

module.exports = router;
