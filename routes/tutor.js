const express = require('express');
const router = express.Router();
const {
  registerTutor,
  loginTutor,
  updateTutorInformation,
  getAllStudents,
  getAllTutors,
  getTutorDetails
} = require('../controllers/tutorController');
const authMiddleware = require('../middleware/tutorMiddleware');

// Public routes
router.post('/register', registerTutor);
router.post('/login', loginTutor);

// Protected routes
router.put('/update', authMiddleware, updateTutorInformation);
router.get('/me', authMiddleware, getTutorDetails);
router.get('/students', authMiddleware, getAllStudents);
router.get('/tutors', authMiddleware, getAllTutors);

module.exports = router;
