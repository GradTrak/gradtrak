const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('dist'));

app.get('/', (req, res)=>{
  res.send('this is the express app')
})
app.get('/api/courses', (req, res)=>{
  res.send('you are retrieving courses from the express app')//todo: replace with courses
})

module.exports = app;
