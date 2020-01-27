//TODO: rename this
const mongoose = require('mongoose');
const Course = require('./models/course.model');

connectDB = ()=>{
  mongoose.connect('mongodb://localhost:databaseName', { useNewUrlParser: true })//default mongod port is 27017
  const db = mongoose.connection;
  console.log(db.name);
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', ()=> {
    console.log("MongoDB connected")
    module.exports.db = db;
  });
}

module.exports.connectDB = connectDB;
