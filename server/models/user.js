const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
          courses: {
            type: [
              {
                type: String,
                ref: 'Course',
              },
            ],
            required: true,
            default: [],
          },
        },
      ],
      required: true,
      default: [],
    },
    goals: {
      type: [
        {
          type: String,
          ref: 'Goal',
        },
      ],
      required: true,
      default: [],
    },
  },
  { strict: 'throw' },
);

module.exports = mongoose.model('User', userSchema);
