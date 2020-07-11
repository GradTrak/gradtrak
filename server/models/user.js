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
      type: Map,
      of: [semesterSchema],
      required: true,
      default: {},
    },
    goalIds: {
      type: [String],
      required: true,
      default: [],
    },
    manuallyFulfilledReqs: {
      type: Map,
      of: [String],
      required: true,
      default: {},
    },
  },
  { strict: 'throw' },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    userdata: {
      type: userDataSchema,
      required: true,
      default: {
        semesters: {},
        goalIds: [],
      },
    },
    emailMarketing: {
      type: Boolean,
      required: true,
      default: false,
    },
    userTesting: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { strict: 'throw' },
);

module.exports = mongoose.model('User', userSchema);
