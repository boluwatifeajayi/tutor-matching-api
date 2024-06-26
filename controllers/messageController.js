// messageController.js
const Message = require('../models/Message');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

const sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;

  try {
    let sender, senderModel, recipientModel;
    if (req.tutor) {
      sender = req.tutor._id;
      senderModel = 'Tutor';
      recipientModel = 'Student';  // Assuming the recipient is a student if sender is a tutor
    } else if (req.student) {
      sender = req.student._id;
      senderModel = 'Student';
      recipientModel = 'Tutor';  // Assuming the recipient is a tutor if sender is a student
    }

    const message = new Message({
      sender,
      senderModel,
      receiver: recipientId,
      receiverModel: recipientModel,
      content,
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const user = req.tutor || req.student;
    const userModel = req.tutor ? 'Tutor' : 'Student';

    const messages = await Message.find({
      $or: [
        { sender: user._id, senderModel: userModel },
        { receiver: user._id },
      ],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

const getConversation = async (req, res) => {
  const { otherUserId, otherUserModel } = req.params;

  try {
    const user = req.tutor || req.student;
    const userModel = req.tutor ? 'Tutor' : 'Student';

    const conversation = await Message.find({
      $or: [
        { sender: user._id, senderModel: userModel, receiver: otherUserId, receiverModel: otherUserModel },
        { sender: otherUserId, senderModel: otherUserModel, receiver: user._id, receiverModel: userModel },
      ],
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get conversation' });
  }
};

const getTutorsForStudent = async (req, res) => {
  try {
    const studentId = req.student._id;

    const senderIds = await Message.find({
      $or: [
        { sender: studentId, senderModel: 'Student' },
        { receiver: studentId, receiverModel: 'Student' }
      ]
    }).distinct('sender');

    const receiverIds = await Message.find({
      $or: [
        { sender: studentId, senderModel: 'Student' },
        { receiver: studentId, receiverModel: 'Student' }
      ]
    }).distinct('receiver');

    const messages = [...senderIds, ...receiverIds];

    const uniqueTutorIds = [...new Set(messages)].filter(id => id.toString() !== studentId.toString());

    const tutors = await Tutor.find({
      _id: { $in: uniqueTutorIds }
    }).select('-password');

    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get tutors' });
  }
};

const getStudentsForTutor = async (req, res) => {
  try {
    const tutorId = req.tutor._id;

    const senderIds = await Message.find({
      $or: [
        { sender: tutorId, senderModel: 'Tutor' },
        { receiver: tutorId, receiverModel: 'Tutor' }
      ]
    }).distinct('sender');

    const receiverIds = await Message.find({
      $or: [
        { sender: tutorId, senderModel: 'Tutor' },
        { receiver: tutorId, receiverModel: 'Tutor' }
      ]
    }).distinct('receiver');

    const messages = [...senderIds, ...receiverIds];

    const uniqueStudentIds = [...new Set(messages)].filter(id => id.toString() !== tutorId.toString());

    const students = await Student.find({
      _id: { $in: uniqueStudentIds }
    }).select('-password');

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get students' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversation,
  getTutorsForStudent,
  getStudentsForTutor
};
