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
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
  numRequired: {
    type: Number,
  },
  requirements: [Object],
  tagId: {
    type: mongoose.Types.ObjectId,
    ref: 'Tag',
  },
  units: {
    type: Number,
  },
});
requirementSchema.requirements = [requirementSchema];

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
    type: mongoose.Types.ObjectId,
    ref: 'RequirementSet',
  },
  requirementCategories: {
    type: [requirementCategorySchema],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('RequirementSet', requirementSetSchema);
