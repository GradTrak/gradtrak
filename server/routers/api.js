const express = require('express');

const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const tagController = require('../controllers/tagController');
const userController = require('../controllers/userController');

const api = express.Router();
api.get('/courses', courseController.getCourses);
api.get('/requirements', requirementController.getRequirements);
api.get('/user', userController.getUserData);
api.get('/tags', tagController.getTags);
api.post('/user', userController.setUserData);

exports.api = api;
