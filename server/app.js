const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const { api } = require('./routers/api');

const app = express();
const Course = require('./models/course.model');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
app.use(express.static('dist'));

mongoose.connect('mongodb://localhost:databaseName', { useNewUrlParser: true })//default mongod port is 27017
var db = mongoose.connection;
console.log(db.name);
console.log("that was the db name");
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB connected")
  const sampleCourse = new Course({
    id: "hi",
    dept: "Bye",
    no: "61a",
    title: "str int cmp pgms",
    units: 4,
    tags: [],
});
  console.log(sampleCourse.id);
  sampleCourse.save(function (err, sampleCourse) {
    if (err) return console.error(err);
    console.log("course saved successfully");
  });
});


module.exports = app;
