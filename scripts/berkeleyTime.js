#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const LIST_ENDPOINT =
  'https://berkeleytime.com/api/catalog/filter/?filters=22619,22620,22621,22622,22623,22624,22625,22626';

const COURSE_ENDPOINT = 'https://berkeleytime.com/api/catalog_json/course_box/?course_id=';

const TAG_MAP = new Map([
  ['American Cultures', 'ac'],
  ['American History', 'ah'],
  ['American Institutions', 'ai'],
  ['College Writing', 'cw'],
  ['Quantitative Reasoning', 'qr'],
  ['Reading and Composition A', 'rc_a'],
  ['Reading and Composition B', 'rc_b'],
  ['Arts and Literature', 'ls_arts'],
  ['Biological Science', 'ls_bio'],
  ['Historial Studies', 'ls_hist'],
  ['International Studies', 'ls_inter'],
  ['Philosophy and Values', 'ls_philo'],
  ['Physical Science', 'ls_phys'],
  ['Social and Behavior Sciences', 'ls_socio'],
]);

if (!fs.existsSync('cache')) {
  fs.mkdirSync('cache');
}

const agent = new https.Agent({
  keepAlive: true,
});

function fetchCourse(courseId) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(`cache/${courseId}.json`)) {
      resolve({
        cached: true,
        data: fs.readFileSync(`cache/${courseId}.json`),
      });
      return;
    }

    const courseUrl = COURSE_ENDPOINT + courseId;
    https.get(courseUrl, { agent: agent }, (res) => {
      let rawData = '';

      res.on('data', (d) => {
        rawData += d;
      });

      res.on('end', () => {
        resolve({
          cached: false,
          data: rawData,
        });
      });
    });
  }).then((result) => {
    let course = JSON.parse(result.data);

    if (!result.cached) {
      fs.writeFile(`cache/${courseId}.json`, result.data, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    return course;
  });
}

async function fetchCourseTags(courses) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    course.tagIds = await fetchCourse(course._id).then((courseData) => {
      return courseData.requirements
        .filter((reqName) => Array.from(TAG_MAP.keys()).includes(reqName))
        .map((reqName) => TAG_MAP.get(reqName));
    });

    delete course._id;

    console.log(`Done: ${i} / ${courses.length}`);
  }
}

https.get(LIST_ENDPOINT, { agent: agent }, (res) => {
  let rawData = '';

  res.on('data', (d) => {
    rawData += d;
  });

  res.on('end', () => {
    const data = JSON.parse(rawData);

    const validCourses = data.filter((course) => !course.units || course.units.match('^\\d+\\.\\d+$'));

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
      course.id = course.dept.replace('\\s', '').toLowerCase() + course.no.replace('\\s', '').toLowerCase();

      // Convert units to number
      course.units = parseFloat(course.units);
    });

    fetchCourseTags(validCourses).then(() => {
      fs.writeFileSync('./berkeleyTime.json', JSON.stringify(validCourses));
    });
  });
});
