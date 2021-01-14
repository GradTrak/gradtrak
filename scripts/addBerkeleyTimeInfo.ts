import Course from '../server/src/models/course';
import RequirementSet from '../server/src/models/requirement-set';
import Tag from '../server/src/models/tag';
import User from '../server/src/models/user';
import { connect } from '../server/src/config/db';


const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
});

function promiseGet(url: string, attemptsRemaining: number = 3): any {
  return new Promise((resolve, reject) => {

    https.get(url, { agent: agent }, (res) => {
        let data = '';

        // called when a data chunk is received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // called when the complete response is received.
        res.on('end', () => {
          const ret = JSON.parse(data);
          if (Object.keys(ret).length === 0 && attemptsRemaining > 0) {
            promiseGet(url, attemptsRemaining - 1).then(resolve).catch(reject);
          } else {
            resolve(ret);
          }
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
    const semestersOfferedArr: {semester: string, year: string}[] = await promiseGet(`https://berkeleytime.com/api/enrollment/sections/${btimeCourseObj.id}/`).catch(()=>[])
    //console.log(semestersOfferedArr)
    mapping[key] = {
      berkeleytimeId: btimeCourseObj.id,
      grade: courseBoxObj && courseBoxObj.letter_average,
      semestersOffered: Array.isArray(semestersOfferedArr)? semestersOfferedArr.map(sem => `${sem.semester} ${sem.year}`): undefined,
    };
    if (mapping[key].grade === undefined) {
      console.log(courseBoxObj)
    }
    console.log(`${key}, ${mapping[key].grade}, ${mapping[key].semestersOffered}`)
  }
  const stepSize: number = 25;
  // for (let i = 900; i < 1000; i += stepSize) {
  for (let i = 0; i < btimeInfo.courses.length; i += stepSize) {
    await(Promise.all(btimeInfo.courses.slice(i, i+stepSize).map(btimeCourse => fetchCourseInfo(btimeCourse).catch((e)=> {
      console.log(e);
    }))))
    console.log('______________________________________________')
  }
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
