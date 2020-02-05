const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
})

module.exports = mongoose.model('tag', tagSchema)
