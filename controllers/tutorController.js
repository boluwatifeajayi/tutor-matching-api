const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

// Register a new tutor
const registerTutor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, teachingMethods, courses, qualifications, availableTime } = req.body;

    const tutorExists = await Tutor.findOne({ email });

    if (tutorExists) {
      return res.status(400).json({ message: 'Tutor already exists' });
    }

    const tutor = new Tutor({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      teachingMethods,
      availableTime,
      courses,
      qualifications,
    });

    await tutor.save();

    res.status(201).json({
      _id: tutor._id,
      firstName: tutor.firstName,
      lastName: tutor.lastName,
      email: tutor.email,
      role: tutor.role,
      availableTime: tutor.availableTime,
      token: jwtUtils.generateToken(tutor._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a tutor
const loginTutor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });

    if (tutor && (await bcrypt.compare(password, tutor.password))) {
      res.json({
        _id: tutor._id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        email: tutor.email,
        token: jwtUtils.generateToken(tutor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update tutor information
const updateTutorInformation = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.tutor._id);

    if (tutor) {
      tutor.firstName = req.body.firstName || tutor.firstName;
      tutor.lastName = req.body.lastName || tutor.lastName;
      tutor.email = req.body.email || tutor.email;
      tutor.teachingMethods = req.body.teachingMethods || tutor.teachingMethods;
      tutor.courses = req.body.courses || tutor.courses;
      tutor.qualifications = req.body.qualifications || tutor.qualifications;
      tutor.availableTime = req.body.availableTime || tutor.availableTime;

      if (req.body.password) {
        tutor.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedTutor = await tutor.save();

      res.json(updatedTutor);
    } else {
      res.status(404).json({ message: 'Tutor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in tutor details
const getTutorDetails = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.tutor._id);

    if (tutor) {
      res.json(tutor);
    } else {
      res.status(404).json({ message: 'Tutor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tutor by ID
const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (tutor) {
      res.json(tutor);
    } else {
      res.status(404).json({ message: 'Tutor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tutors under a particular course
const getTutorsByCourse = async (req, res) => {
  try {
    const tutors = await Tutor.find({ courses: req.params.course });

    if (tutors.length > 0) {
      res.json(tutors);
    } else {
      res.status(404).json({ message: 'No tutors found for this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search tutors
const searchTutors = async (req, res) => {
  try {
    const { firstName, lastName, courses, qualifications, teachingMethods } = req.query;

    const query = {};

    if (firstName) query.firstName = new RegExp(firstName, 'i');
    if (lastName) query.lastName = new RegExp(lastName, 'i');
    if (courses) query.courses = { $in: courses.split(',') };
    if (qualifications) query.qualifications = new RegExp(qualifications, 'i');
    if (teachingMethods) query.teachingMethods = { $in: teachingMethods.split(',') };

    const tutors = await Tutor.find(query);

    if (tutors.length > 0) {
      res.json(tutors);
    } else {
      res.status(404).json({ message: 'No tutors found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tutors
const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({});
    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerTutor,
  loginTutor,
  updateTutorInformation,
  getAllStudents,
  getAllTutors,
  getTutorDetails,
  getTutorById,
  getTutorsByCourse,
  searchTutors,
};
