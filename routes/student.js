const express = require('express');
const {
  registerStudent,
  loginStudent,
  getStudentDetails,
  updateStudentDetails,
  getMatchingTutors,
  addReviewToTutor,
} = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', authMiddleware, getStudentDetails);
router.put('/update', authMiddleware, updateStudentDetails);
router.get('/matching-tutors', authMiddleware, getMatchingTutors);
router.post('/add-review', authMiddleware, addReviewToTutor);

module.exports = router;
