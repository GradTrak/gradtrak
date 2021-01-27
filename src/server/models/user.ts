import mongoose from 'mongoose';

import { UserDataPrototype } from '../../common/prototypes/user-data.prototype';

/* Make sure to set up the appropriate migration in the migrations folder if
 * you update the schema. */
export const USER_SCHEMA_VERSION = 1;

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseIds: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { strict: 'throw', _id: false },
);

const userDataSchema = new mongoose.Schema(
  {
    semesters: {
      type: Map,
      of: [semesterSchema],
      required: true,
      default: {},
    },
    goalIds: {
      type: [String],
      required: true,
      default: [],
    },
    manuallyFulfilledReqs: {
      type: Map,
      of: [String],
      required: true,
      default: {},
    },
  },
  { strict: 'throw', _id: false },
);

export type UserType = {
  username: string;
  passwordHash?: string;
  googleId?: string;
  userdata: UserDataPrototype;
  emailMarketing: boolean;
  userTesting: boolean;
};

const userSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      index: true,
      required: true,
      default: USER_SCHEMA_VERSION,
    },
    username: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    userdata: {
      type: userDataSchema,
      required: true,
      default: {
        semesters: {},
        goalIds: [],
      },
    },
    emailMarketing: {
      type: Boolean,
      required: false,
      default: true,
    },
    userTesting: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { strict: 'throw' },
);

const User = mongoose.model<mongoose.Document & UserType>('User', userSchema);

declare module 'express' {
  export interface Request {
    user?: mongoose.Document & UserType;
  }
}

export default User;
