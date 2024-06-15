// combinedAuthMiddleware.js
const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

const combinedAuthMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user is a tutor
      const tutor = await Tutor.findById(decoded.id).select('-password');
      if (tutor) {
        req.tutor = tutor;
        return next();
      }

      // Check if the user is a student
      const student = await Student.findById(decoded.id).select('-password');
      if (student) {
        req.student = student;
        return next();
      }

      // If neither, respond with unauthorized
      res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = combinedAuthMiddleware;
