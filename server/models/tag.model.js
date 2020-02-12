const mongoose = require('mongoose');

const {Schema} = mongoose;

const tagSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('tag', tagSchema);
