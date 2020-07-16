import argon2 from 'argon2';
import util from 'util';

import { verifyUser } from '../config/passport';
import * as smtp from '../config/smtp';
import { validateEmail } from '../lib/utils';
import User from '../models/user';

function validPassword(password) {
  return password.length >= 6;
}

export async function register(req, res) {
  if (req.user) {
    res.status(400).json({
      success: false,
      error: 'Already logged in',
    });
    return;
  }

  const { username, password, userTesting } = req.body;
  if (
    username === undefined ||
    username === null ||
    password === undefined ||
    password === null ||
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
    res.status(400).json({
      success: false,
      error: 'Invalid email address',
    });
    return;
  }
  if (!validPassword(password)) {
    res.status(400).json({
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
    userTesting,
  });
  await util.promisify(req.login).bind(req)(newUser);
  res.json({
    username,
    success: true,
    auth: 'local',
  });

  smtp.sendMail({
    to: username,
    ...smtp.WELCOME_EMAIL,
  });
}

export function logout(req, res) {
  if (req.user) {
    req.logout();
    res.status(204).send();
  } else {
    res.status(400).json({
      error: 'Not logged in',
    });
  }
}

export function loginSuccessLocal(req, res) {
  res.json({
    success: true,
    username: req.user.username,
    auth: 'local',
  });
}

export function loginSuccessGoogle(req, res) {
  res.json({
    success: true,
    username: req.user.username,
    auth: 'google',
  });
}

export function loginFailure(req, res) {
  res.status(200).json({
    success: false,
    error: 'Invalid username or password',
  });
}

export function whoami(req, res) {
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
}

export async function changePassword(req, res) {
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

  req.user.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
  await req.user.save();

  res.json({
    success: true,
  });
}

export function getUserData(req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  res.json(req.user.userdata);
}

export function setUserData(req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  req.user.userdata = req.body;
  req.user.save().then(() => {
    res.status(204).send();
  });
}
