import mongoose from 'mongoose';

import { TagPrototype } from '../../common/prototypes/tag.prototype';

export const TAG_SCHEMA_VERSION = 1;

const tagSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      required: true,
      default: TAG_SCHEMA_VERSION,
    },
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
  },
  { strict: 'throw' },
);

const Tag = mongoose.model<mongoose.Document & TagPrototype>('Tag', tagSchema);

export default Tag;
