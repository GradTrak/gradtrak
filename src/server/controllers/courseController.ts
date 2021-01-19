import express from 'express';

import { CoursePrototype } from '../../common/prototypes/course.prototype';
import Course from '../models/course';

/**
queries mongo for any course models and calls successCallback on what is returned
*/
async function queryCourses(): Promise<CoursePrototype[]> {
  return Course.find({}, { _id: 0, __v: 0 });
}

export async function getCourses(req: express.Request, res: express.Response): Promise<void> {
  res.json(await queryCourses());
}
