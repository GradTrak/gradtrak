const fs = require('fs');

fs.readFile('berkeleytime.json', (err, data) => {
  if (err) {
    throw err;
  }

  bt = JSON.parse(data);
  bt = bt.filter((course) => course.units.length === 1 || course.units.length === 3);
  bt.forEach((course) => {
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
      delete course.abbreviation;
      course.no = course.course_number;
      delete course.course_number;

      course.id = course.dept.toLowerCase().replace(' ', '') + course.no.toLowerCase().replace(' ', '');

      if (course.units[2] === '0') {
        course.units = parseInt(course.units[0]);
      } else {
        course.units = parseFloat(course.units);
      }
    });

  fs.writeFile('berkeleytime.parsed.json', JSON.stringify(bt), () => {});
});
