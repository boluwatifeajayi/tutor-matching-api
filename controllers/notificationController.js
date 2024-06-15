const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

// Create a notification
const createNotification = async (userId, userType, message) => {
  try {
    const notification = new Notification({
      userId,
      userType,
      message
    });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Get all notifications for a student
const getStudentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.student._id, userType: 'student' }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all notifications for a tutor
const getTutorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.tutor._id, userType: 'tutor' }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getStudentNotifications,
  getTutorNotifications
};
