const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  courseIds: {
    type: [String], //courseIds
  }
})

module.exports = mongoose.model('semester', semesterSchema)
