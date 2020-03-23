#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const LIST_ENDPOINT = 'https://berkeleytime.com/api/catalog/filter/?filters=22623,22626,32259,32036';

const COURSE_ENDPOINT = 'https://berkeleytime.com/api/catalog_json/course_box/?course_id=';

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
      delete course.id;
      delete course.letter_average;

      course.dept = course.abbreviation;
      course.no = course.course_number;
      delete course.abbreviation;
      delete course.course_number;

      course.id = course.dept.replace('\\s', '').toLowerCase() + course.no.replace('\\s', '').toLowerCase();

      // Convert units to number
      course.units = parseFloat(course.units);

      if (i < 1) {
        https.get(COURSE_ENDPOINT + course.id, (res) => {
          let rawData = '';

          res.on('data', (d) => {
            rawData += d;
          });

          res.on('end', () => {
            const courseData = JSON.parse(rawData);

            console.log(courseData);
          });
        });
        i++;
      }
    });
  });
});
