const argon2 = require('argon2');
const util = require('util');

const { verifyUser } = require('../config/passport');
const smtp = require('../config/smtp');
const { validateEmail } = require('../lib/utils');
const User = require('../models/user');

function validPassword(password) {
  return password.length >= 6;
}

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
  if (!validateEmail(username)) {
    // TODO Send status code 400 once client-side validation is implemented
    res.json({
      success: false,
      error: 'Invalid email address',
    });
    return;
  }
  if (!validPassword(password)) {
    // TODO Send status code 400 once client-side validation is implemented
    res.json({
      success: false,
      error: 'Invalid password',
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

  smtp.sendMail({
    to: username,
    ...smtp.WELCOME_EMAIL,
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
      auth: req.user.googleId ? 'google' : 'local',
    });
  } else {
    res.json({
      loggedIn: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Not logged in',
    });
    return;
  }
  if (req.user.googleId) {
    res.status(400).json({
      success: false,
      error: 'You are currently authenticated with Google',
    });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  if (oldPassword === undefined || oldPassword === null || newPassword === undefined || newPassword === null) {
    res.status(400).json({
      success: false,
      error: 'Old password or new password not provided',
    });
    return;
  }
  if (!validPassword(newPassword)) {
    res.json({
      success: false,
      error: 'New password is invalid',
    });
    return;
  }

  const verify = await verifyUser(req.user, oldPassword);
  if (!verify) {
    res.json({
      success: false,
      error: 'Incorrect current password',
    });
    return;
  }

  req.user.passwordHash = await argon2.hash(newPassword, { mode: argon2.argon2id });
  await req.user.save();

  res.json({
    success: true,
  });
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
