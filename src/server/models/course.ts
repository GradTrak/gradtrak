import mongoose from 'mongoose';

import { CoursePrototype } from '../../common/prototypes/course.prototype';

/* Make sure to set up the appropriate migration in the migrations folder if
 * you update the schema. */
export const COURSE_SCHEMA_VERSION = 2;

const berkeleytimeDataSchema = new mongoose.Schema(
  {
    berkeleytimeId: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: false,
    },
    semestersOffered: {
      type: [String],
      required: false,
    },
  },
  { strict: 'throw', _id: false },
);

const courseSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      index: true,
      required: true,
      default: COURSE_SCHEMA_VERSION,
    },
    id: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    dept: {
      type: String,
      required: true,
    },
    no: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    berkeleytimeData: {
      type: berkeleytimeDataSchema,
      required: true,
    },
    tagIds: {
      type: [String],
      required: true,
      default: [],
    },
    equivIds: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { strict: 'throw' },
);

const Course = mongoose.model<mongoose.Document & CoursePrototype>('Course', courseSchema);

export default Course;
