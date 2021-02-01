import mongoose from 'mongoose';

import { CoursePrototype } from '../../common/prototypes/course.prototype';

export type CourseType = CoursePrototype & mongoose.Document;

const berkeleytimeDataSchema = new mongoose.Schema({
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
});

const courseSchema = new mongoose.Schema(
  {
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

const Course = mongoose.model<CourseType>('Course', courseSchema);

export default Course;
