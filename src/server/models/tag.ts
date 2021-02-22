import mongoose from 'mongoose';

import { TagPrototype } from '../../common/prototypes/tag.prototype';

/* Make sure to set up the appropriate migration in the migrations folder if
 * you update the schema. */
export const TAG_SCHEMA_VERSION = 1;

export type TagType = TagPrototype & mongoose.Document;

const tagSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      index: true,
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

const Tag = mongoose.model<TagType>('Tag', tagSchema);

export default Tag;
