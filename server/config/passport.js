const { Strategy } = require('passport-local');

const User = require('../models/user');

const localStrategy = new Strategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      done(err);
      return;
    }

    if (!user || !user.verifyPassword(password)) {
      done(null, false, { message: 'Incorrect username or password' });
      return;
    }

    done(null, user);
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
