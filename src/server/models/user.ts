import mongoose from 'mongoose';

import { UserDataPrototype } from '../../common/prototypes/user-data.prototype';

/* Make sure to set up the appropriate migration in the migrations folder if
 * you update the schema. */
export const USER_SCHEMA_VERSION = 2;

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

const scheduleSchema = new mongoose.Schema(
  {
    semesters: {
      type: Map,
      of: {
        type: [semesterSchema],
      },
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
      of: {
        type: [String],
      },
      required: true,
      default: {},
    },
  },
  { strict: 'throw', _id: false },
);

const userDataSchema = new mongoose.Schema(
  {
    schedules: {
      type: Map,
      of: {
        type: scheduleSchema,
      },
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
  userData: UserDataPrototype;
  emailMarketing: boolean;
  userTesting: boolean;
} & mongoose.Document;

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
    userData: {
      type: userDataSchema,
      required: true,
      default: {
        schedules: {},
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

const User = mongoose.model<UserType>('User', userSchema);

declare module 'express' {
  export interface Request {
    user?: UserType;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserType;
  }
}

export default User;
