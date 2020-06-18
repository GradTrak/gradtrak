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
    mutexReqIds: {
      type: [String],
    }
  },
  { strict: 'throw' },
);
