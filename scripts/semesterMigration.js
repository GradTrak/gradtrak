const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');


const seasonVal = {
  'Spring' : 1,
  'Summer' : 2,
  'Fall' : 0,
}

const findAcadYear = semester => {
  const semArr = semester.name.split(' ');
  const semesterYear = parseInt(semArr[1], 10) - (semArr[0] !== 'Fall' ? 1 : 0); // this feels so incredibly clunky.
  return `${semesterYear.toString()}-${(semesterYear + 1).toString()}`;
}
const db = require('../server/config/db');
db.connect()
  .then((c) => {
    const conn = c;
    return User.find();
    //TODO: Query everything and then modify their semesters and then dump it back in.
  }).then((users) => {
    console.log();console.log();console.log();console.log();console.log();console.log();console.log();

    const newUsers = users.forEach(user => {
      let semesterArr = [].concat(...user.userdata.semesters.values())
      const semesters = new Map();
      console.log(semesterArr)
      semesterArr.forEach((semester) => {
        const academicYearName = findAcadYear(semester);
        const semArr = semester.name.split(' ');
        const index = seasonVal[semArr[0]];
        if (semesters.get(academicYearName)) {
          semesters.get(academicYearName)[index] = semester;
        } else {
          semesters.set(academicYearName, [null, null, null]);
          semesters.get(academicYearName)[index] = semester;
        }
      });

      user.userdata.semesters = semesters
      console.log(semesters)
      user.save();
    });

    return conn;
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    conn.close();
    cache.del('*', (err, deleted) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Cache flushed: ${deleted} keys deleted`);
      }
      cache.client.quit();
    });
  });
