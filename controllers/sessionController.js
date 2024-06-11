const Session = require('../models/Session');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

// Student books a session with a tutor
const bookSession = async (req, res) => {
  try {
    const { tutorId, courseName, date, time } = req.body;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Check if the tutor is available at the requested date and time
    const day = new Date(date).getDay();
    const availableTimes = tutor.availableTime.get(day.toString());
    // if (!availableTimes || !availableTimes.includes(time)) {
    //   return res.status(400).json({ message: 'Tutor is not available at the requested date and time' });
    // }

    const session = new Session({
      courseName,
      date,
      time,
      student: {
        studentID: req.student._id,
        firstName: req.student.firstName,
        lastName: req.student.lastName,
        state: req.student.state,
      },
      tutor: {
        tutorID: tutor._id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        qualifications: tutor.qualifications,
      },
      sessionStatus: 'pending',
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tutor approves or rejects a session booking request
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId, status, duration, meetingType, meetingLink, location } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (status === 'scheduled') {
      session.sessionStatus = 'scheduled';
      session.duration = duration;
      session.meetingType = meetingType;
      if (meetingType === 'online') {
        session.meetingLink = meetingLink;
      } else {
        session.location = location;
      }
    } else if (status === 'rejected') {
      session.sessionStatus = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get session requests for a tutor
const getSessionRequestsForTutor = async (req, res) => {
  try {
    const sessions = await Session.find({ 'tutor.tutorID': req.tutor._id, sessionStatus: 'pending' });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get session booked list for a student
const getSessionListForStudent = async (req, res) => {
  try {
    const sessions = await Session.find({ 'student.studentID': req.student._id });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tutor cancels a session
const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.sessionStatus = 'canceled';

    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tutor sets session status to completed
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.sessionStatus = 'completed';

    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  bookSession,
  updateSessionStatus,
  getSessionRequestsForTutor,
  getSessionListForStudent,
  cancelSession,
  completeSession,
};
