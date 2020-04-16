const argon2 = require('argon2');
const { Strategy } = require('passport-local');

const User = require('../models/user');

async function verifyUser(user, inputPassword) {
  if (!user) {
    /* Verify dummy password to prevent timing attack enumerating users */
    /* This is the hash of 'password' if anyone is curious */
    const dummy = '$argon2id$v=19$m=4096,t=3,p=1$bPaz0G0LK/r5aSoCQsU8Bg$8mbAff+svZA0QV3XH5i5vSPTYBE5xd4rmVZEDF0umvA';
    await argon2.verify(dummy, inputPassword);
    return null;
  } else if (!(await argon2.verify(user.passwordHash, inputPassword))) {
    return null;
  }
  return user;
}

const localStrategy = new Strategy((username, inputPassword, done) => {
  User.findOne({ username })
    .then((user) => verifyUser(user, inputPassword))
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: 'Incorrect username or password' });
      }
    });
});

/* eslint-disable no-underscore-dangle */

module.exports.serializeUser = (user, done) => {
  done(null, user._id);
};

module.exports.deserializeUser = (_id, done) => {
  User.findOne({ _id }, done);
};

/* eslint-enable no-underscore-dangle */

module.exports.authStrategy = localStrategy;
