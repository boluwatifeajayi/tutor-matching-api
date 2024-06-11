const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TutorSchema = new mongoose.Schema({
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
  availableTime: {
    type: Map,
    of: [String],
    default: {}
  },
  courses: {
    type: [String],
    default: []
  },
  qualifications: {
    type: String,
    default: ''
  },
  reviews: [{
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentFirstName: String,
    studentLastName: String,
    studentState: String,
    createdDate: {
      type: Date,
      default: Date.now
    }
  }],
  teachingMethods: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    default: 'tutor',
  },
});

TutorSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = Tutor;
