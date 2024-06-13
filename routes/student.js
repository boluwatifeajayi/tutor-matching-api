const express = require('express');
const {
  registerStudent,
  loginStudent,
  getStudentDetails,
  updateStudentDetails,
  getMatchingTutors,
  addReviewToTutor,
  getStudentById,
  searchStudents,
  getAllStudents,
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', authMiddleware, getStudentDetails);
router.put('/update', authMiddleware, updateStudentDetails);
router.get('/matching-tutors', authMiddleware, getMatchingTutors);
router.post('/add-review', authMiddleware, addReviewToTutor);
router.get('/get/:id', getStudentById);
router.get('/search', searchStudents);
router.get('/all', getAllStudents);

module.exports = router;
