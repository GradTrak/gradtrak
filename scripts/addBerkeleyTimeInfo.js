const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');
const db = require('../server/config/db');

const https = require('https');


const promiseGet = (url) => {
  return new Promise((resolve, reject) => {

    https.get(url, (res) => {
        let data = '';

        // called when a data chunk is received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // called when the complete response is received.
        res.on('end', () => {
          const ret = JSON.parse(data);
          resolve(ret);
        });

    }).on("error", (err) => {
        reject(err)
    });

  })
}

/**
 * bTimeInfo should be the course information from the berkeleytime API.
 * queries the courses and converts it by adding a berkeleytime field, and saves it back
 */
const main = async () => {
  bTimeInfo = await promiseGet('https://berkeleytime.com/api/catalog/catalog_json/');
  const mapping = {};
  const fetchCourseInfo = async (bTimeCourseObj) => {
    const key = `${bTimeCourseObj.abbreviation} ${bTimeCourseObj.course_number.toUpperCase()}`
    const courseBoxObj = (await promiseGet(`https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=${bTimeCourseObj.id}`)).course
    const semestersOfferedArr = await promiseGet(`https://berkeleytime.com/api/enrollment/sections/${bTimeCourseObj.id}/`)
    mapping[key] = {
      berkeleyTimeId: bTimeCourseObj.id,
      averageGrade: courseBoxObj && courseBoxObj.letter_average,
      semestersOffered: semestersOfferedArr? semestersOfferedArr.map(sem => `${sem.semester} ${sem.year}`): undefined,
    };
    console.log(key)
  }
  for await (let bTimeCourse of bTimeInfo.courses) {
    await fetchCourseInfo(bTimeCourse);
  }
  let connection;
  db.connect()
    .then((c) => {
      connection = c;
      return Course.find()
    }).then(courses => {
      Promise.all(courses.map(course => {
        const key = `${course.dept} ${course.no.toUpperCase()}`
        const bTimeData = mapping[key]
        course.berkeleyTimeId = undefined;
        course.berkeleyTimeData = bTimeData;
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

//promiseGet('https://berkeleytime.com/api/catalog/catalog_json/').then(a => console.log(a))
//promiseGet('https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=2347').then(a => console.log(a))
//promiseGet('https://berkeleytime.com/api/enrollment/sections/2347/').then(a => console.log(a))


main()
