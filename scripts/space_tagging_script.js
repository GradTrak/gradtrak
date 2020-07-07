const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './tagging_lists/' + 'foreign_language.txt'; //change to whatever
const TAG = 'eecs_natural_science';

/*
var eligibleCourses = fs.readFileSync(MY_FILE).toString();
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
*/
//console.log(eligibleCourses);
//process.exit(1)

const allowed = ['ASTRON', 'CHEM', 'EPS', 'INTEGBI', 'MCELLBI', 'PHYSICS', 'PLANTBI']
data.forEach((course) => {
  //if (eligibleCourses.includes(course.id.toLowerCase())) {
  if (allowed.includes(course.dept) && course.units >= 3 && course.no.replace(/[A-Za-z]/g, '') >= 100 && course.no.replace(/[A-Za-z]/g, '') < 200) {
    if (!course.tagIds.includes(TAG)) {
      console.log(course.id)
      course.tagIds = [...course.tagIds, TAG];
    }
  }
});
const saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
})
