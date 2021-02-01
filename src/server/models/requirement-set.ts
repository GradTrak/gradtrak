import mongoose from 'mongoose';

import { RequirementSetPrototype } from '../../common/prototypes/requirement-set.prototype';

export type RequirementSetType = RequirementSetPrototype & mongoose.Document;

const constraintSchema = new mongoose.Schema(
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
    },
  },
  { strict: 'throw', _id: false },
);

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
      enum: ['course', 'multi', 'poly', 'tag', 'unit', 'count', 'regex'],
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
    constraints: {
      type: [constraintSchema],
    },
    deptRegex: {
      type: String,
    },
    numberRegex: {
      type: String,
    },
  },
  { strict: 'throw', _id: false },
);
requirementSchema.add({
  requirement: {
    type: requirementSchema,
  },
  requirements: {
    type: [requirementSchema],
  },
});

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
    constraints: {
      type: [constraintSchema],
    },
  },
  { strict: 'throw', _id: false },
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
      type: [constraintSchema],
    },
    selfConstraints: {
      type: [constraintSchema],
    },
  },
  { strict: 'throw' },
);

const RequirementSet = mongoose.model<RequirementSetType>('RequirementSet', requirementSetSchema);

export default RequirementSet;
