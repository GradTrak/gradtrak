#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const LIST_ENDPOINT =
  'https://berkeleytime.com/api/catalog/filter/?filters=22619,22620,22621,22622,22623,22624,22625,22626';

const COURSE_ENDPOINT = 'https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=';

const TAG_MAP = new Map([
  ['American Cultures', 'ac'],
  ['American History', 'ah'],
  ['American Institutions', 'ai'],
  ['College Writing', 'cw'],
  ['Quantitative Reasoning', 'qr'],
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

    course.tagIds = await fetchCourse(course._id)
      .then((courseData) => {
        return courseData.requirements
          .filter((reqName) => Array.from(TAG_MAP.keys()).includes(reqName))
          .map((reqName) => TAG_MAP.get(reqName));
      })
      .catch((err) => {
        console.error(`Error getting course with ID ${course._id}:`);
        console.error(err);
        return [];
      });

    delete course._id;

    if (i % 100 === 0) {
      console.log(`Done: ${i} / ${courses.length}`);
    }
  }
}

https.get(LIST_ENDPOINT, { agent: agent }, (res) => {
  let rawData = '';

  res.on('data', (d) => {
    rawData += d;
  });

  res.on('end', () => {
    const data = JSON.parse(rawData);

    const validCourses = data.filter(
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

    fetchCourseTags(validCourses).then(() => {
      const courses = Array.from(courseMap.values());
      courses.sort((a, b) => {
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
      fs.writeFileSync('./berkeleyTime.json', JSON.stringify(courses));
    });
  });
});
