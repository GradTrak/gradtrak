const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { api } = require('./routers/api');
const mongooseHost = require('./mongooseHost');
const courseController = require('./controllers/courseController')
connectDB = mongooseHost.connectDB;
initializeDBCourses = courseController.initializeDBCourses;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));
connectDB();
initializeDBCourses();
module.exports = app;
