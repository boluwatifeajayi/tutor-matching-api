const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const studentRoutes = require('./routes/student');
const tutorRoutes = require('./routes/tutor');
const sessionRoutes = require('./routes/session');
const messageRoutes = require('./routes/message');
const notificationRoutes = require('./routes/notification');
const data = require('./utils/data');

dotenv.config();

const app = express();
app.use(express.json());

app.use(morgan('dev')); 

app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notification', notificationRoutes);

// New GET route for popular disciplines
app.get('/api/disciplines', (req, res) => {
  res.json(data.popularDisciplines);
});

// New GET route for popular skills
app.get('/api/skills', (req, res) => {
  res.json(data.popularSkills);
});

// New GET route for popular learning styles
app.get('/api/learning-styles', (req, res) => {
  res.json(data.popularLearningStyles);
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  // ... (mongoose options)
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });