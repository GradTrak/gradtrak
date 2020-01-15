const express = require('express');

const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const userController = require('../controllers/userController');
const tagController = require('../controllers/tagController');
const goalController = require('../controllers/goalController');

const api = express.Router();
api.post('/goal', goalController.postGoals)
api.get('/goal', goalController.getGoals);
api.get('/courses', courseController.getCourses);
api.get('/semesters', userController.getSemesters);
api.get('/requirements', requirementController.getRequirements);
api.use('/tags', tagController.getTags);

exports.api = api;
