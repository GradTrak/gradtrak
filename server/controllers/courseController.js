const Course = require('../models/course');

/**
queries mongo for any course models and calls successCallback on what is returned
*/
async function queryCourses() {
  return Course.find();
}

module.exports.getCourses = async (req, res) => {
  res.json(await queryCourses());
};
