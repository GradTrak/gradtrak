const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './bioeeligibleCourses.txt'; //change to whatever



var eligibleCourses = fs.readFileSync(MY_FILE).toString()
eligibleCourses = eligibleCourses.split('\n').map(line => line.split(' '))
eligibleCourses = eligibleCourses.flatmap(line => {
  var regex = /\d/g;
  if (regex.test(line[1])) { //if the dept name is one word
    return (line[0] + line[1]).toLowerCase()
  }
  else if (regex.test(line[2])) {
    return (line[0] + line[1] + line[2]).toLowerCase()
  } else {
    console.warn("HEEEEELLPP THIS IS POORLY PARSED!");
  }
});
//console.log(eligibleCourses);
//process.exit(1)
data.forEach((course) => {
  const no = course.no.replace(/[a-zA-Z]/, "");
  if (eligibleCourses.includes(course.id.toLowerCase())) {
    if (!course.tagIds.includes('bioeng_technical_topics')) {
      console.log(course.id)
      course.tagIds = [...course.tagIds, 'bioeng_technical_topics'];
    }
  }
});
const saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
})
