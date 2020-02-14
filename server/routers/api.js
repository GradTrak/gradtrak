const express = require('express');
const passport = require('passport');

const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const tagController = require('../controllers/tagController');
const userController = require('../controllers/userController');

const api = express.Router();
api.get('/courses', courseController.getCourses);
api.get('/requirements', requirementController.getRequirements);
api.get('/tags', tagController.getTags);

api.get('/user', userController.getUserData);
api.put('/user', userController.setUserData);

api.post(
  '/login',
  passport.authenticate('local', { failWithError: true }),
  (req, res) => {
    res.json({
      success: true,
      username: req.user.username,
    });
  },
  (err, req, res, next) => {
    res.status(200).json({
      success: false,
    });
  },
);
api.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.status(204).send();
  } else {
    res.status(400).json({
      error: 'Not logged in',
    });
  }
});

exports.api = api;
