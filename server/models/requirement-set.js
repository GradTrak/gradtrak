const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['course', 'multi', 'mutex', 'poly', 'tag', 'unit'],
      required: true,
    },
    courseId: {
      type: String,
    },
    numRequired: {
      type: Number,
    },
    requirement: {
      type: Object,
    },
    requirements: {
      type: [Object],
    },
    hidden: {
      type: Boolean,
    },
    tagId: {
      type: String,
    },
    units: {
      type: Number,
    },
    universalConstraints: {
      type: Constraint,
    },
    selfConstraints: {
      type: Constraint,
    },
  },
  { strict: 'throw' },
);
requirementSchema.requirement = requirementSchema;
requirementSchema.requirements = [requirementSchema];

const requirementCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    requirements: {
      type: [requirementSchema],
      required: true,
      default: [],
    },
    universalConstraints: {
      type: Constraint,
    },
    selfConstraints: {
      type: Constraint,
    },
  },
  { strict: 'throw' },
);

const requirementSetSchema = new mongoose.Schema(
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
      unique: true,
    },
    type: {
      type: String,
      enum: ['unselectable', 'major', 'minor', 'other'],
      required: true,
    },
    parentId: String,
    requirementCategories: {
      type: [requirementCategorySchema],
      required: true,
      default: [],
    },
    universalConstraints: {
      type: Constraint,
    },
    selfConstraints: {
      type: Constraint,
    },
  },
  { strict: 'throw' },
);

module.exports = mongoose.model('RequirementSet', requirementSetSchema);
