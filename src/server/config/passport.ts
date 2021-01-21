import argon2 from 'argon2';
import express from 'express';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy } from 'passport-local';

import User, { UserType } from '../models/user';

export async function verifyUser(user: UserType, inputPassword: string): Promise<boolean> {
  if (!user || !user.passwordHash) {
    /* Verify dummy password to prevent timing attack enumerating users */
    /* This is the hash of 'password' if anyone is curious */
    const dummy = '$argon2id$v=19$m=4096,t=3,p=1$bPaz0G0LK/r5aSoCQsU8Bg$8mbAff+svZA0QV3XH5i5vSPTYBE5xd4rmVZEDF0umvA';
    await argon2.verify(dummy, inputPassword);
    return false;
  } else if (!(await argon2.verify(user.passwordHash, inputPassword))) {
    return false;
  }
  return true;
}

export const localStrategy = new Strategy(async (username, inputPassword, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user || !(await verifyUser(user, inputPassword))) {
      done(null, false, { message: 'Incorrect username or password' });
      return;
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const googleStrategy = new GoogleStrategy(
  {
    clientID:
      process.env.GOOGLE_OAUTH2_CLIENT_ID || '193968115710-tbotc192sopukgp3b13741d1puvlarsk.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET || 'l4DbnSBR-YVKXfKCKJXuvOi3',
    callbackURL: `${process.env.HOST || 'http://localhost:4200'}/login/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    if (!profile.emails || !profile.emails[0]) {
      done(new Error('Invalid profile'));
      return;
    }
    const username = profile.emails[0].value;
    const googleId = profile.id;
    try {
      let user = await User.findOne({ googleId });
      if (user) {
        done(null, user);
        return;
      }

      user = await User.findOne({ username });
      if (user) {
        user.googleId = googleId;
        user.passwordHash = undefined;
        await user.save();
        done(null, user);
        return;
      }

      user = await User.create({
        username,
        googleId: profile.id,
      } as UserType);
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */

export function serializeUser(req: express.Request, user: object, done: (err: any, id?: string) => void): void {
  if (!req.user) {
    done(new Error('Cannot serialize undefined user'));
    return;
  }
  done(null, req.user._id);
}
export function deserializeUser(req: express.Request, id: string, done: (err: any, user?: UserType) => void): void {
  User.findOne({ _id: id }, done);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-enable no-underscore-dangle */
