const mongoose = require('mongoose');

const { Schema } = mongoose;
// const Requirement = require('../models/requirement.model');

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  semesters: {
    type: [Object],
  },
  goals: {
    type: [Object],
  },
});

module.exports = mongoose.model('user', userSchema);
