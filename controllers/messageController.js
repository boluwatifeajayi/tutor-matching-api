const Message = require('../models/Message');
const { createNotification } = require('./notificationController');

// Send a message
const sendMessage = async (req, res) => {
  const { senderId, senderType, receiverId, receiverType, content } = req.body;

  try {
    const message = new Message({
      senderId,
      senderType,
      receiverId,
      receiverType,
      content
    });

    await message.save();

    // Create a notification for the receiver
    createNotification(receiverId, receiverType, 'You have a new message');

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all messages for a user
const getMessages = async (req, res) => {
  const userId = req.student ? req.student._id : req.tutor._id;
  const userType = req.student ? 'Student' : 'Tutor';

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, senderType: userType },
        { receiverId: userId, receiverType: userType }
      ]
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
