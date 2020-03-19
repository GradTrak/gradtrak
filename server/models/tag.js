const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
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
  },
  { strict: 'throw' },
);

module.exports = mongoose.model('Tag', tagSchema);
