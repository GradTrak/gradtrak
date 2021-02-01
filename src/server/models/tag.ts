import mongoose from 'mongoose';

import { TagPrototype } from '../../common/prototypes/tag.prototype';

export type TagType = TagPrototype & mongoose.Document;

const tagSchema = new mongoose.Schema(
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
    },
  },
  { strict: 'throw' },
);

const Tag = mongoose.model<TagType>('Tag', tagSchema);

export default Tag;
