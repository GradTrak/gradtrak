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
