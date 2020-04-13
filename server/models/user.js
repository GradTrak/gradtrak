const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
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
  { strict: 'throw' },
);

const userDataSchema = new mongoose.Schema(
  {
    semesters: {
      type: [semesterSchema],
      required: true,
      default: [],
    },
    goalIds: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { strict: 'throw' },
);

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
    userdata: {
      type: userDataSchema,
      required: true,
      default: {
        semesters: [],
        goalIds: [],
      },
    },
  },
  { strict: 'throw' },
);

userSchema.methods.verifyPassword = function verifyPassword(inputPassword) {
  return this.password === inputPassword;
};

module.exports = mongoose.model('User', userSchema);
