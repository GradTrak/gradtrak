const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Course = require('../models/course.model');

const semesterSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  courses: {
    type: [Course],
  }
})

module.exports = mongoose.model('semester', semesterSchema)
