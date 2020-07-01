#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const LIST_ENDPOINT =
  'https://berkeleytime.com/api/catalog/filter/?filters=22619,22620,22621,22622,22623,22624,22625,22626';

const COURSE_ENDPOINT = 'https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=';

const DUMMY_COURSE_DATA = './dummy/berkeleyTime.json';

const TAG_MAP = new Map([
  ['American Cultures', 'ac'],
  ['American History', 'ah'],
  ['American Institutions', 'ai'],
  ['College Writing', 'cw'],
  ['Quantitative Reasoning', 'ls_quant'],
  ['Reading and Composition A', 'rc_a'],
  ['Reading and Composition B', 'rc_b'],
  ['Arts and Literature', 'ls_arts'],
  ['Biological Sciences', 'ls_bio'],
  ['Historical Studies', 'ls_hist'],
  ['International Studies', 'ls_inter'],
  ['Philosophy and Values', 'ls_philo'],
  ['Physical Science', 'ls_phys'],
  ['Social and Behavioral Sciences', 'ls_socio'],
]);

if (!fs.existsSync('cache')) {
  fs.mkdirSync('cache');
}

const agent = new https.Agent({
  keepAlive: true,
});

async function fetchCourse(courseId) {
  if (fs.existsSync(`cache/${courseId}.json`)) {
    return JSON.parse(fs.readFileSync(`cache/${courseId}.json`));
  } else {
    const courseUrl = COURSE_ENDPOINT + courseId;
    const res = await fetch(courseUrl, { agent });
    const data = await res.json();
    fs.writeFile(`cache/${courseId}.json`, JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      }
    });
    return data;
  }
}

async function fetchCourseTags(course) {
  try {
    const courseData = await fetchCourse(course._id);
    return courseData.requirements
      .filter((reqName) => Array.from(TAG_MAP.keys()).includes(reqName))
      .map((reqName) => TAG_MAP.get(reqName));
  } catch (err) {
    console.error(`Error getting course with ID ${course._id}:`);
    console.error(err);
    return [];
  }
}

(async () => {
  const res = await fetch(LIST_ENDPOINT, { agent: agent });
  const data = await res.json();

  let validCourses = data.filter(
    (course) => course.units && (course.units.match(/^\d+\.\d+$/) || course.units.match(/^\d+$/)),
  );
  const courseMap = new Map();

  validCourses.forEach((course) => {
    delete course.open_seats;
    delete course.description;
    delete course.enrolled_percentage;
    delete course.favorite_count;
    delete course.waitlisted;
    delete course.enrolled;
    delete course.grade_average;
    delete course.letter_average;

    course.dept = course.abbreviation;
    course.no = course.course_number;
    delete course.abbreviation;
    delete course.course_number;

    course._id = course.id;
    course.id = (course.dept + course.no).replace(/[^A-Za-z\d]/, '').toLowerCase();

    // Convert units to number
    course.units = parseFloat(course.units);

    if (courseMap.has(course.id)) {
      console.error(`Warning: Course with id ${course.id} has conflict`);
    } else {
      courseMap.set(course.id, course);
    }
  });
  validCourses = Array.from(courseMap.values());

  for (let i = 0; i < validCourses.length; i++) {
    const course = validCourses[i];
    const tags = await fetchCourseTags(course);
    course.tagIds = tags;
    delete course._id;
    if (i % 100 === 0) {
      console.log(`Done: ${i} / ${validCourses.length}`);
    }
  }

  validCourses.sort((a, b) => {
    if (a.dept === b.dept) {
      const aNo = parseInt(a.no.replace(/[^\d]/g, ''));
      const bNo = parseInt(b.no.replace(/[^\d]/g, ''));

      if (aNo === bNo) {
        return a.no > b.no ? 1 : -1;
      }
      return aNo > bNo ? 1 : -1;
    }
    return a.dept > b.dept ? 1 : -1;
  });
  fs.writeFileSync(DUMMY_COURSE_DATA, JSON.stringify(validCourses));
})();
