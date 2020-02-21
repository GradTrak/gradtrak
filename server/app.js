const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { api } = require('./routers/api');
const mongooseHost = require('./mongooseHost');
const courseController = require('./controllers/courseController');
const requirementController = require('./controllers/requirementController');
const tagController = require('./controllers/tagController');
const userController = require('./controllers/userController');

const { connectDB } = mongooseHost;
const { initializeDBCourses } = courseController; // eslint-disable-line no-unused-vars
const { initializeDBReqs } = requirementController; // eslint-disable-line no-unused-vars
const { initializeDBTags } = tagController; // eslint-disable-line no-unused-vars
const { addUser } = userController; // eslint-disable-line no-unused-vars
const { retrieveAllTags } = tagController; // eslint-disable-line no-unused-vars
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));
connectDB();
// initializeDBReqs();
// initializeDBCourses();
// initializeDBTags();
// addUser("BryanWasHere", {}, {})
module.exports = app;
