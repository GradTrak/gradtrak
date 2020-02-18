const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Tag', tagSchema);
