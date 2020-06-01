const express = require('express');
const passport = require('passport');

const { cache } = require('../config/cache');

const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const tagController = require('../controllers/tagController');
const userController = require('../controllers/userController');

const api = express.Router();
api.get('/courses', cache.route(), courseController.getCourses);
api.get('/requirements', cache.route(), requirementController.getRequirements);
api.get('/tags', cache.route(), tagController.getTags);

api.get('/user', userController.getUserData);
api.put('/user', userController.setUserData);

api.post('/account/register', userController.register);
api.post(
  '/account/login',
  passport.authenticate('local', { failWithError: true }),
  userController.loginSuccess,
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    res.status(200);
    userController.loginFailure(req, res);
  },
);
api.post('/account/logout', userController.logout);
api.get('/account/whoami', userController.whoami);
api.post('/account/password', userController.changePassword);

exports.api = api;
