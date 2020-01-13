const express = require('express');
const api = express.Router();
const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const semesterController = require('../controllers/semesterController');

api.get('/courses', courseController.getCourses);
api.get('/semesters', semesterController.getSemesters);
api.get('/requirements', requirementController.getRequirements);

exports.api = api
