const Course = require('../models/course');

/**
queries mongo for any course models and calls successCallback on what is returned
*/
function queryCourses() {
  return Course.find().exec();
}

module.exports.getCourses = (req, res) => {
  queryCourses().then((courses) => res.json(courses));
};

module.exports.queryCourses = queryCourses;
