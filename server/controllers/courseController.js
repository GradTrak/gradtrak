const Course = require('../models/course');

/**
queries mongo for any course models and calls successCallback on what is returned
*/
async function queryCourses() {
  return Course.find({}, { _id: 0, __v: 0 });
}

module.exports.getCourses = async (req, res) => {
  res.json(await queryCourses());
};
