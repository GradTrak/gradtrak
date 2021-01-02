const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');
const db = require('../server/config/db');

const https = require('https');



/**
 * bTimeInfo should be the course information from the berkeleytime API.
 * queries the courses and converts it by adding a berkeleytime field, and saves it back
 */
const main = (bTimeInfo) => {
  const mapping = {};
  bTimeInfo.forEach(bTimeCourseObj => {
    const key = `${bTimeCourseObj.abbreviation} ${bTimeCourseObj.course_number.toUpperCase()}`
    mapping[key] = bTimeCourseObj.id;
  })
  let connection;
  db.connect()
    .then((c) => {
      connection = c;
      return Course.find()
    }).then(courses => {
      Promise.all(courses.map(course => {
        const key = `${course.dept} ${course.no.toUpperCase()}`
        const bTimeId = mapping[key]
        if (!bTimeId) {
          console.log(key)
          course.berkeleyTimeId = undefined;
        } else {
          course.berkeleyTimeId = bTimeId;
        }
        return course.save().catch(console.error);
      })).then(() => {
        connection.close();
        console.log("CONNECTION CLOSED")
      });
    })
    .catch((err) => {
      console.error(err);
    })
}


https.get('https://berkeleytime.com/api/grades/grades_json/', (res) => {
    let data = '';

    // called when a data chunk is received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // called when the complete response is received.
    res.on('end', () => {
      const berkeleyTimeData = JSON.parse(data);
      main(berkeleyTimeData.courses);
    });

}).on("error", (err) => {
    console.log("Error: ", err.message);
});

