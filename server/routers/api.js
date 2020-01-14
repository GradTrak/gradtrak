const express = require('express');

const courseController = require('../controllers/courseController');
const requirementController = require('../controllers/requirementController');
const semesterController = require('../controllers/semesterController');
const tagController = require('../controllers/tagController');

const api = express.Router();

api.use('/courses', courseController.getCourses);
api.use('/semesters', semesterController.getSemesters);
api.use('/requirements', requirementController.getRequirements);
api.use('/tags', tagController.getTags);

exports.api = api;
