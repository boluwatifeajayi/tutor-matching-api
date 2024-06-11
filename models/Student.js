const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  discipline: {
    type: String,
    required: true
  },
  learningStyle: {
    type: [String], 
    default: []
  },
  courses: {
    type: [String], 
    default: []
  },
  role: {
    type: String,
    default: 'student',
  },
});

StudentSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
