import mongoose from 'mongoose';

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

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
