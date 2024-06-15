const express = require('express');
const { sendMessage, getMessages, getConversation, getStudentsForTutor, getTutorsForStudent } = require('../controllers/messageController');
const combinedAuthMiddleware = require('../middleware/combinedAuthMiddleware');

const router = express.Router();

router.post('/send', combinedAuthMiddleware, sendMessage);
router.get('/all', combinedAuthMiddleware, getMessages);
router.get('/conversation/:otherUserId/:otherUserModel', combinedAuthMiddleware, getConversation);
router.get('/tutors', combinedAuthMiddleware, getTutorsForStudent);
router.get('/students', combinedAuthMiddleware, getStudentsForTutor);

module.exports = router;
