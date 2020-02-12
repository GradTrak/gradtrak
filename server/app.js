const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { api } = require('./routers/api');
const mongooseHost = require('./mongooseHost');
const courseController = require('./controllers/courseController')
const requirementController = require('./controllers/requirementController')
const tagController = require('./controllers/tagController')
const userController = require('./controllers/userController');
connectDB = mongooseHost.connectDB;
initializeDBCourses = courseController.initializeDBCourses;
initializeDBReqs = requirementController.initializeDBReqs;
initializeDBTags = tagController.initializeDBTags;
addUser = userController.addUser;
retrieveAllTags = tagController.retrieveAllTags;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));
connectDB();
initializeDBReqs();
initializeDBCourses();
initializeDBTags();
addUser("BryanWasHere", {}, {})
console.log("KDJFGHDKFJGHKDFJHGDKFJGHDKFJHGDKFJH");
queryTags((tags) => {
  console.log(tags);
})
module.exports = app;
