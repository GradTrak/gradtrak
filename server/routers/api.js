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

api.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(204).send();
});

exports.api = api;
