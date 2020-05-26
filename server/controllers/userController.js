const argon2 = require("argon2");
const User = require("../models/user");

exports.register = (req, res) => {
  if (req.user) {
    res.status(400).json({
      error: "Already logged in"
    });
    return;
  }
  const { email, password, emailMarketing, userTesting } = req.body;
  if (!email || !password || !emailMarketing || !userTesting) {
    res.status(400).json({
      error: "Missing registration fields"
    })
  }
  argon2.hash(password, { type: argon2.argon2id }).then((passwordHash) => {
    return User.create({
      username: email,
      passwordHash,
      emailMarketing,
      userTesting,
    });
  }).then((newUser) => {
    req.login(newUser, (err) => {
      if (err) {
        res.status(500).json({
          error: "Internal server error",
        });
        return;
      }
      res.json({
        email,
      });
    });
  })
}

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
