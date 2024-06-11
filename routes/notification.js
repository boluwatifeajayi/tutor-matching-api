const express = require('express');
const router = express.Router();
const { getStudentNotifications, getTutorNotifications } = require('../controllers/notificationController');
const studentAuthMiddleware = require('../middleware/authMiddleware');
const tutorAuthMiddleware = require('../middleware/tutorMiddleware');

// Get all notifications for a student
router.get('/student', studentAuthMiddleware, getStudentNotifications);

// Get all notifications for a tutor
router.get('/tutor', tutorAuthMiddleware, getTutorNotifications);

module.exports = router;
