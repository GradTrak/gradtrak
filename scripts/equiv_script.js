const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './tagging_lists/' + 'fpf.txt'; //change to whatever
const TAG = 'rc_a';

///*
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

data.forEach((course) => {
  if (eligibleCourses.includes(course.id.toLowerCase())) {
    const courseName = course.id.slice(1)
    course.equivIds = course.equivIds || []
    if (!course.equivIds.includes(courseName)) {
      console.log(course.id)
      course.equivIds = [...course.equivIds, courseName];
    }
  }
});
let saveString = JSON.stringify(data, null, 2);
fs.writeFileSync('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
  console.log(saveString);
})
