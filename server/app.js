const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var logger = require('morgan');
var courseController = require('./courseController');
var requirementController = require('./requirementController');
var semesterController = require('./semesterController');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('dist'));

app.get('/', (req, res)=>{
  res.send('this is the express app');
});

app.get('/api/courses', courseController.getCourses);
app.get('/api/semesters', semesterController.getSemesters);
app.get('/api/requirements', requirementController.getRequirements);


module.exports = app;
