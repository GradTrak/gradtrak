const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Semester = require('../models/semester.model');
const Requirement = require('../models/requirement.model');

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  semesterIds: {
    type: [String],//semesterIDs
  },
  goalIds: {
    type: [String],//requirementIDs
  }
})

module.exports = mongoose.model('user', userSchema)
