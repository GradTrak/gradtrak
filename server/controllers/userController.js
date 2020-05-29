const argon2 = require("argon2");
const User = require("../models/user");

exports.register = (req, res) => {
  if (req.user) {
    res.status(400).json({
      error: "Already logged in",
      success: false,
    });
    return;
  }
  const { email, password, emailMarketing, userTesting } = req.body;
  if (email === undefined || email === null
      || password === undefined || password === null
      || emailMarketing === undefined || emailMarketing === null
      || userTesting === undefined || userTesting === null) {
    res.status(400).json({
      error: "Missing registration fields",
      success: false,
    });
    return;
  }
  User.findOne({ username: email }).then((user) => {
    console.log(user);
    if (user) {
      res.json({
        success: false,
        error: "User with that email already exists",
      });
      return;
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
            error: "Internal server error #1",
            success: false,
          });
          return;
        }
        res.json({
          email,
          success: true,
        });
      });
    }).catch((err) => {
      res.status(500).json({
        error: "Internal server error #2",
        success: false,
      });
      return;
    })
  });
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
