const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    semesters: {
      type: [
        {
          id: {
            type: String,
            required: true,
            unique: true,
          },
          name: {
            type: String,
            required: true,
          },
          courseIds: {
            type: [String],
            required: true,
            default: [],
          },
        },
      ],
      required: true,
      default: [],
    },
    goals: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { strict: 'throw' },
);

module.exports = mongoose.model('User', userSchema);
