const Course = require('../models/course');

/**
queries mongo for any course models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
function queryCourses(successCallback) {
  return Course.find().exec((err, courseList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(courseList);
  });
}

module.exports.getCourses = (req, res) => {
  queryCourses((courses) => res.json(courses));
};

module.exports.queryCourses = queryCourses;
