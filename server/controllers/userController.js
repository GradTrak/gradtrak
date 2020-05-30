const argon2 = require('argon2');
const { verifyUser } = require('../config/passport');

function validPassword(password) {
  return password.length >= 6;
}

exports.changePassword = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Not logged in',
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
