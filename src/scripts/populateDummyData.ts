#!/usr/bin/env npx ts-node

/* eslint-disable no-console, no-param-reassign */

import fs from 'fs';

import { cache } from '../server/config/cache';
import * as db from '../server/config/db';

import Course from '../server/models/course';
import RequirementSet from '../server/models/requirement-set';
import Tag from '../server/models/tag';
import User from '../server/models/user';

const DUMMY_DIR = 'dummy';

const DUMMY_COURSE_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/berkeleyTime.json`).toString());
const DUMMY_REQUIREMENT_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/requirement.json`).toString());
const DUMMY_TAG_DATA = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/tag.json`).toString());
const DUMMY_USERS = JSON.parse(fs.readFileSync(`./${DUMMY_DIR}/user.json`).toString());

(async () => {
  const conn = await db.connect();
  try {
    await Tag.deleteMany({});
    console.log('tags cleared');
    await Tag.insertMany(DUMMY_TAG_DATA);
    console.log('new tags inserted');
    await Promise.all(DUMMY_COURSE_DATA.map((course) => Course.updateOne({ id: course.id }, course, { upsert: true })));
    console.log('courses updated');
    await RequirementSet.deleteMany({});
    console.log('requirements cleared');
    await RequirementSet.insertMany(DUMMY_REQUIREMENT_DATA);
    console.log('new requirements updated');
    await Promise.all(DUMMY_USERS.map((user) => User.updateOne({ username: user.username }, user, { upsert: true })));
    console.log('users updated. Populate complete');
  } catch (err) {
    console.error(err);
  } finally {
    conn.close();
    cache.del('*', (err, deleted) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Cache flushed: ${deleted} keys deleted`);
      }
      cache.client.quit();
    });
  }
})();
