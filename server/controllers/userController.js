const argon2 = require('argon2');
const { verifyUser } = require('../config/passport');

function validPassword(password) {
  return password.length >= 6;
}

async function changePassword(user, oldPassword, newPassword) {
  if (!validPassword(newPassword)) {
    return 'New password is invalid';
  }
  const verify = await verifyUser(user, oldPassword);
  if (!verify) {
    return 'Incorrect password';
  }
  user.passwordHash = await argon2.hash(newPassword, { mode: argon2.argon2id });
  user.save();
  return null;
}

exports.changePassword = (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  const { oldPassword, newPassword } = req.body;
  if (oldPassword === undefined || oldPassword === null || newPassword === undefined || newPassword === null) {
    res.status(400).json({
      error: 'Old password or new password not provided',
    });
    return;
  }

  changePassword(req.user, oldPassword, newPassword).then((err) => {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      res.status(204).send();
    }
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
