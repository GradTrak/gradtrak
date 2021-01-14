import mongoose from 'mongoose';

import { CoursePrototype } from '../../common/prototypes/course.prototype';

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
      berkeleytimeId: {
        type: String,
        required: false,
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
