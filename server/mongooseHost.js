//TODO: rename this
const mongoose = require('mongoose');
const Course = require('./models/course.model');

connectDB = ()=>{
  mongoose.connect('mongodb://localhost:databaseName', { useNewUrlParser: true })//default mongod port is 27017
  const db = mongoose.connection;
  console.log(db.name);
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
}
module.exports = connectDB;
