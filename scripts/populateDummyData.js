#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */

const fs = require('fs');

const db = require('../server/config/db');

const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');

const DUMMY_DIR = 'dummy';

const DUMMY_COURSE_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/course.json`));
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
    return Tag.insertMany(DUMMY_TAG_DATA);
  })
  .then(() => {
    return Course.deleteMany({});
  })
  .then(() => {
    return Course.insertMany(DUMMY_COURSE_DATA);
  })
  .then(() => {
    return RequirementSet.deleteMany({});
  })
  .then(() => {
    return RequirementSet.insertMany(DUMMY_REQUIREMENT_DATA);
  })
  .then(() => {
    return Promise.all(DUMMY_USERS.map((user) => User.updateOne({ username: user.username }, user, { upsert: true })));
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    conn.close();
  });
