const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

// Register a new student
const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, learningStyle, courses, discipline } = req.body;

    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = new Student({
      firstName,
      lastName,
      email,
      discipline,
      password: await bcrypt.hash(password, 10),
      learningStyle,
      courses,
    });

    await student.save();

    res.status(201).json({
      _id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      discipline: student.discipline,
      email: student.email,
      role: student.role,
      token: jwtUtils.generateToken(student._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        discipline: student.discipline,
        token: jwtUtils.generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student details
const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student details
const updateStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.email = req.body.email || student.email;
      student.learningStyle = req.body.learningStyle || student.learningStyle;
      student.courses = req.body.courses || student.courses;
      student.discipline = req.body.discipline || student.discipline;

     

      const updatedStudent = await student.save();

      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tutors based on student's learning style and courses
const getMatchingTutors = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (student) {
      const tutors = await Tutor.find({
        teachingMethods: { $in: student.learningStyle },
        courses: { $in: student.courses },
      });

      res.json(tutors);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add review to a tutor
const addReviewToTutor = async (req, res) => {
  try {
    const { tutorId, rating, comment } = req.body;

    const tutor = await Tutor.findById(tutorId);

    if (tutor) {
      const review = {
        rating,
        comment,
        studentID: req.student._id,
        studentFirstName: req.student.firstName,
        studentLastName: req.student.lastName,
        studentState: req.student.state,
        createdDate: Date.now()
      };

      tutor.reviews.push(review);
      await tutor.save();

      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Tutor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for students based on discipline, names, learning styles, and courses
const searchStudents = async (req, res) => {
  try {
    const { discipline, firstName, lastName, learningStyle, courses } = req.query;
    const query = {};

    if (discipline) {
      query.discipline = { $regex: new RegExp(discipline, 'i') };
    }
    if (firstName) {
      query.firstName = { $regex: new RegExp(firstName, 'i') };
    }
    if (lastName) {
      query.lastName = { $regex: new RegExp(lastName, 'i') };
    }
    if (learningStyle) {
      query.learningStyle = { $regex: new RegExp(learningStyle, 'i') };
    }
    if (courses) {
      query.courses = { $regex: new RegExp(courses, 'i') };
    }

    const students = await Student.find(query);

    if (students.length > 0) {
      res.json(students);
    } else {
      res.status(404).json({ message: 'No students found' });
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

module.exports = {
  registerStudent,
  loginStudent,
  getStudentDetails,
  updateStudentDetails,
  getMatchingTutors,
  addReviewToTutor,
  getStudentById,
  searchStudents,
  getAllStudents,
};
