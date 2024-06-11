const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/student');
const tutorRoutes = require('./routes/tutor');
const sessionRoutes = require('./routes/session');
const messageRoutes = require('./routes/message');



dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {

})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
