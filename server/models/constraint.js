const mongoose = require('mongoose');

module.exports.constraintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { strict: 'throw' },
);
