const express = require('express');
const router = express.Router();
const {
  registerTutor,
  loginTutor,
  updateTutorInformation,
  getAllStudents,
  getAllTutors,
  getTutorDetails,
  getTutorById,
  getTutorsByCourse,
  searchTutors,
  getMatchedStudents,
} = require('../controllers/tutorController');
const authMiddleware = require('../middleware/tutorMiddleware');

// Public routes
router.post('/register', registerTutor);
router.post('/login', loginTutor);

// Protected routes
router.put('/update', authMiddleware, updateTutorInformation);
router.get('/me', authMiddleware, getTutorDetails);
router.get('/students', getAllStudents);
router.get('/tutors', getAllTutors);

// New routes
router.get('/get/:id', getTutorById);
router.get('/course/:course', getTutorsByCourse);
router.get('/search', searchTutors);
router.get('/matched-students', authMiddleware, getMatchedStudents);

module.exports = router;
