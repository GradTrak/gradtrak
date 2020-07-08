import Course from '../models/course';

/**
queries mongo for any course models and calls successCallback on what is returned
*/
async function queryCourses() {
  return Course.find();
}

export async function getCourses(req, res) {
  res.json(await queryCourses());
}
