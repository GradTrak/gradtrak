#!/usr/bin/env node

const fs = require('fs');

const { cache } = require('../server/config/cache');
const db = require('../server/config/db');

const Course = require('../server/models/course');

const DUMMY_DIR = 'dummy';

const DUMMY_COURSE_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/course.json`));

const dummyCourseMap = new Map();
DUMMY_COURSE_DATA.forEach((course) => {
  dummyCourseMap.set(course.id, course);
});

let conn;

db.connect()
  .then((c) => {
    conn = c;
    return Course.deleteMany({});
  })
  .then(() => {
    const coursesJson = fs.readFileSync('./berkeleyTime.json');
    const courses = JSON.parse(coursesJson);

    // Include tags from the dummy data in course.json
    courses.forEach((course) => {
      if (dummyCourseMap.has(course.id)) {
        course.tagIds = [...new Set([...course.tagIds, ...dummyCourseMap.get(course.id).tagIds])];
      }
    });

    return Course.insertMany(courses);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    conn.close();
    cache.del('erc:*', (err, deleted) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Cache flushed: ${deleted} keys deleted`);
      }
      cache.client.quit();
    });
  });
