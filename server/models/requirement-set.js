const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['course', 'multi', 'mutex', 'poly', 'tag', 'unit'],
    required: false, // TODO Make this true
  },
  courseId: {
    type: String,
    ref: 'Course',
  },
  numRequired: {
    type: Number,
  },
  requirements: [Object],
  tagId: {
    type: String,
    ref: 'Tag',
  },
  units: {
    type: Number,
  },
});

const requirementCategorySchema = new mongoose.Schema({
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
  requirements: {
    type: [requirementSchema],
    required: true,
    default: [],
  },
});

const requirementSetSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parentId: {
    type: String,
    ref: 'Requirement',
  },
  requirementCategories: {
    type: [],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('RequirementSet', requirementSetSchema);
