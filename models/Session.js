const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
  },
  student: {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    
  },
  tutor: {
    tutorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
  },
  meetingType: {
    type: String,
    enum: ['online', 'in-person'],
  },
  meetingLink: {
    type: String,
    required: function () { return this.meetingType === 'online'; },
  },
  location: {
    type: String,
    required: function () { return this.meetingType === 'in-person'; },
  },
  sessionStatus: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'canceled', 'rejected'],
    default: 'pending',
  },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
