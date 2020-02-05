const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    required: true,
    unique: true,
  },
  no: {
    type: String,
    required: true,
    unique: true,
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
  tags: Array,
})

module.exports = mongoose.model('tag', tagSchema)
