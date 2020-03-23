#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const LIST_ENDPOINT = 'https://berkeleytime.com/api/catalog/filter/?filters=22623,22626,32259,32036';

const COURSE_ENDPOINT = 'https://berkeleytime.com/api/catalog_json/course_box/?course_id=';

const TAG_MAP = new Map([
  ['Arts and Literature', 'ls_arts'],
  ['Biological Science', 'ls_bio'],
  ['Historial Studies', 'ls_hist'],
  ['International Studies', 'ls_inter'],
  ['Philosophy and Values', 'ls_philo'],
  ['Physical Science', 'ls_phys'],
  ['Social and Behavior Sciences', 'ls_socio'],
]);

https.get(LIST_ENDPOINT, (res) => {
  let rawData = '';

  res.on('data', (d) => {
    rawData += d;
  });

  res.on('end', () => {
    const data = JSON.parse(rawData);

    const validCourses = data.filter((course) => !course.units || course.units.match('^\\d+\\.\\d+$'));

    let i = 0;
    data.forEach((course) => {
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

      let btCourseId = course.id;
      course.id = course.dept.replace('\\s', '').toLowerCase() + course.no.replace('\\s', '').toLowerCase();

      // Convert units to number
      course.units = parseFloat(course.units);

      if (i < 10) {
        https.get(COURSE_ENDPOINT + btCourseId, (res) => {
          let rawData = '';

          res.on('data', (d) => {
            rawData += d;
          });

          res.on('end', () => {
            console.log(rawData);
            const courseData = JSON.parse(rawData);

            course.tagIds = courseData.requirements
              .filter((reqName) => Array.from(TAG_MAP.keys()).includes(reqName))
              .map((reqName) => TAG_MAP.get(reqName));

            console.log(course);
          });
        });
        i++;
      }
    });
  });
});
