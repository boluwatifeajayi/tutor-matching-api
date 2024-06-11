const express = require('express');
const router = express.Router();
const {
  bookSession,
  updateSessionStatus,
  getSessionRequestsForTutor,
  getSessionListForStudent,
  cancelSession,
  completeSession,
} = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const tutMiddleware = require('../middleware/tutorMiddleware');


// Student books a session
router.post('/book', authMiddleware, bookSession);

// Tutor approves or rejects a session
router.put('/update-status', tutMiddleware, updateSessionStatus);

// Get session requests for a tutor
router.get('/requests', tutMiddleware, getSessionRequestsForTutor);

// Get session booked list for a student
router.get('/student-sessions', authMiddleware, getSessionListForStudent);

// Tutor cancels a session
router.put('/cancel', tutMiddleware, cancelSession);

// Tutor sets session status to completed
router.put('/complete', tutMiddleware, completeSession);

module.exports = router;
