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
let conn;
db.connect()
  .then((c) => {
    conn = c;
    return User.find();
    //TODO: Query everything and then modify their semesters and then dump it back in.
  }).then((users) => {
    let lastcall;
    const newUsers = users.forEach(user => {
      console.log('\n\n\n\n\n\n\n\n\n\n')

      let semesterArr = [].concat(...user.userdata.semesters.values())
      const semesters = new Map();
      console.log(semesterArr)
      semesterArr.forEach((semester) => {
        if (semester === null) return;
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

      user.userdata.semesters = semesters;
      console.log(user)
      lastcall = user.save()
      return lastcall;
    });

    return lastcall;
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    conn.close();
    console.log("CONNECTION CLOSED")
  });
