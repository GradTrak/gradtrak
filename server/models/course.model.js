const mongoose = require('mongoose');

const {Schema} = mongoose;

const courseSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    required: true,
    unique: false,
  },
  no: {
    type: String,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  units: {
    type: Number,
    required: true,
  },
  tagIds: [String],
});

module.exports = mongoose.model('course', courseSchema);
