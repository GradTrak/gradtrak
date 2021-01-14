import mongoose from 'mongoose';

import { TagPrototype } from '../../common/prototypes/tag.prototype';

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

const Tag = mongoose.model<mongoose.Document & TagPrototype>('Tag', tagSchema);

export default Tag;
