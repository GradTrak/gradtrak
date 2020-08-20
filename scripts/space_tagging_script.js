const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './tagging_lists/' + 'fpf.txt'; //change to whatever
const TAG = 'english_elective';
//const allowed = ['BIO ENG', 'CHEM', 'CHM ENG', 'CIV ENG', 'MATH', 'EL ENG', 'ING ENG', 'MECH ENG', 'MCELLBI', 'PHYSICS', 'STAT']//'ASTRON', 'CHEM', 'EPS', 'INTEGBI', 'MCELLBI', 'PHYSICS', 'PLANTBI']
const TAG_OR_NOT_FUNC = (course) => {
  return course.dept === 'ENGLISH' && course.no !== 'R1A' && course.no !== 'R1B';
  return course.no.toLowerCase().match(/ac$/) && (course.dept[0]!== 'X')
};
const processEligibleCourses = false;
let eligibleCourses;
if (processEligibleCourses){
  eligibleCourses = fs.readFileSync(MY_FILE).toString();
  eligibleCourses = eligibleCourses.split('\n').map(line => line.split(' '))
  eligibleCourses = eligibleCourses.map(line => {
    var regex = /\d/g;
    if (regex.test(line[1])) { //if the dept name is one word
      return (line[0] + line[1]).toLowerCase()
    }
    else if (regex.test(line[2])) {
      return (line[0] + line[1] + line[2]).toLowerCase()
    } else {
      console.warn("HEEEEELLPP THIS IS POORLY PARSED!:",  line);
    }
  }).filter(a => a);

  console.log(eligibleCourses);
  process.exit(1)
}
data.forEach((course) => {
  if (TAG_OR_NOT_FUNC(course)) {
    if (!course.tagIds.includes(TAG)) {
      console.log(course.id, TAG)
      course.tagIds = [...course.tagIds, TAG];
    }
  }
});
//process.exit();
saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
})
