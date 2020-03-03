const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    required: true,
  },
  no: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  tagIds: {
    type: [String],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Course', courseSchema);
