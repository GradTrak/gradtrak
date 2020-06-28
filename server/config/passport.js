const argon2 = require('argon2');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy } = require('passport-local');

const User = require('../models/user');

async function verifyUser(user, inputPassword) {
  if (!user) {
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

const localStrategy = new Strategy(async (username, inputPassword, done) => {
  const user = await User.findOne({ username });

  if (!(await verifyUser(user, inputPassword))) {
    done(null, false, { message: 'Incorrect username or password' });
    return;
  }
  done(null, user);
});

const googleStrategy = new GoogleStrategy(
  {
    clientID: '193968115710-tbotc192sopukgp3b13741d1puvlarsk.apps.googleusercontent.com',
    clientSecret: 'l4DbnSBR-YVKXfKCKJXuvOi3',
    callbackURL: 'http://localhost:4200/login/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOrCreate({ googleId: profile.id });
    done(user);
  },
);

/* eslint-disable no-underscore-dangle */

module.exports.serializeUser = (user, done) => {
  done(null, user._id);
};

module.exports.deserializeUser = (_id, done) => {
  User.findOne({ _id }, done);
};

/* eslint-enable no-underscore-dangle */

module.exports.verifyUser = verifyUser;
module.exports.localStrategy = localStrategy;
module.exports.googleStrategy = googleStrategy;
