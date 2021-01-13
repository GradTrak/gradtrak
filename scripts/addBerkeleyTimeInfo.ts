import Course from '../server/src/models/course';
import RequirementSet from '../server/src/models/requirement-set';
import Tag from '../server/src/models/tag';
import User from '../server/src/models/user';
import { connect } from '../server/src/config/db';


const https = require('https');


function promiseGet(url: string): any {
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
 * btimeInfo should be the course information from the berkeleytime API.
 * queries the courses and converts it by adding a berkeleytime field, and saves it back
 */
const main = async () => {
  const btimeInfo = await promiseGet('https://berkeleytime.com/api/catalog/catalog_json/');
  const mapping = {};
  const fetchCourseInfo = async (btimeCourseObj: {id: string, abbreviation: string, course_number: string}) => {
    const key: string = `${btimeCourseObj.abbreviation} ${btimeCourseObj.course_number.toUpperCase()}`
    const courseBoxObj = (await promiseGet(`https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=${btimeCourseObj.id}`)).course
    const semestersOfferedArr: {semester: string, year: string}[] = await promiseGet(`https://berkeleytime.com/api/enrollment/sections/${btimeCourseObj.id}/`)
    mapping[key] = {
      berkeleytimeId: btimeCourseObj.id,
      grade: courseBoxObj && courseBoxObj.letter_average,
      semestersOffered: semestersOfferedArr? semestersOfferedArr.map(sem => `${sem.semester} ${sem.year}`): undefined,
    };
    console.log(key, courseBoxObj && courseBoxObj.letter_average)
  }
  await(Promise.all(btimeInfo.courses.map(btimeCourse => fetchCourseInfo(btimeCourse))))
  let connection;
  connect()
    .then((c) => {
      connection = c;
      return Course.find()
    }).then(courses => {
      Promise.all(courses.map(course => {
        const key = `${course.dept} ${course.no.toUpperCase()}`
        const btimeData = mapping[key]
        course.berkeleytimeData = btimeData;
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
