#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */

const fs = require('fs');

const { cache } = require('../server/config/cache');
const db = require('../server/config/db');

const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');

const DUMMY_DIR = 'dummy';

const DUMMY_COURSE_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/berkeleyTime.json`));
const DUMMY_REQUIREMENT_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/requirement.json`));
const DUMMY_TAG_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/tag.json`));
const DUMMY_USERS = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/user.json`));

let conn;

db.connect()
  .then((c) => {
    conn = c;
    return Tag.deleteMany({});
  })
  .then(() => {
    console.log('tags cleared');
    return Tag.insertMany(DUMMY_TAG_DATA);
  })
  .then(() => {
    console.log('new tags inserted');
    return Promise.all(
      DUMMY_COURSE_DATA.map((course) => Course.updateOne({ id: course.id }, course, { upsert: true })),
    );
  })
  .then(() => {
    console.log('courses updated');
    return RequirementSet.deleteMany({});
  })
  .then(() => {
    console.log('requirements cleared');
    return RequirementSet.insertMany(DUMMY_REQUIREMENT_DATA);
  })
  .then(() => {
    console.log('new requirements updated');
    return Promise.all(DUMMY_USERS.map((user) => User.updateOne({ username: user.username }, user, { upsert: true })));
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log('users updated. Populate complete');
    conn.close();
    cache.del('*', (err, deleted) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Cache flushed: ${deleted} keys deleted`);
      }
      cache.client.quit();
    });
  });
