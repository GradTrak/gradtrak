const argon2 = require('argon2');
const util = require('util');

const User = require('../models/user');

exports.register = async (req, res) => {
  if (req.user) {
    res.status(400).json({
      success: false,
      error: 'Already logged in',
    });
    return;
  }

  const { username, password, emailMarketing, userTesting } = req.body;
  if (
    username === undefined ||
    username === null ||
    password === undefined ||
    password === null ||
    emailMarketing === undefined ||
    emailMarketing === null ||
    userTesting === undefined ||
    userTesting === null
  ) {
    res.status(400).json({
      success: false,
      error: 'Missing registration fields',
    });
    return;
  }

  const user = await User.findOne({ username });
  if (user) {
    res.json({
      success: false,
      error: 'User with that email already exists',
    });
    return;
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const newUser = await User.create({
    username,
    passwordHash,
    emailMarketing,
    userTesting,
  });
  await util.promisify(req.login).bind(req)(newUser);
  res.json({
    username,
    success: true,
  });
};

exports.logout = (req, res) => {
  if (req.user) {
    req.logout();
    res.status(204).send();
  } else {
    res.status(400).json({
      error: 'Not logged in',
    });
  }
};

exports.loginSuccess = (req, res) => {
  res.json({
    success: true,
    username: req.user.username,
  });
};

exports.loginFailure = (req, res) => {
  res.status(200).json({
    success: false,
  });
};

exports.whoami = (req, res) => {
  if (req.user) {
    res.json({
      loggedIn: true,
      username: req.user.username,
    });
  } else {
    res.json({
      loggedIn: false,
    });
  }
};

exports.getUserData = (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  res.json(req.user.userdata);
};

exports.setUserData = (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  req.user.userdata = req.body;
  req.user.save().then(() => {
    res.status(204).send();
  });
};
