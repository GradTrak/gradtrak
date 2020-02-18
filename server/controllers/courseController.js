const Course = require('../models/course.model');

/**
queries mongo for any course models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
const queryCourse = (successCallback) => {
  return Course.find().exec((err, courseList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(courseList);
  });
};

exports.getCourses = (req, res) => {
  // res.json(DUMMY_COURSE_DATA);
  queryCourse((courses) => res.json(courses));
  // for some reason simply putting res.json doesn't work but this lambda does sooooo
};
