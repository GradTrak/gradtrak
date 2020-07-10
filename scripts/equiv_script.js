const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './tagging_lists/' + 'fpf.txt'; //change to whatever
const processEligibleCourses = false;
const courseArr = data.map(course => course.id);
const IS_EQUIV = (course) => {
  return course.no.toLowerCase()[0] === 'w' && courseArr.includes(course.id.replace(course.no.toLowerCase(), course.no.toLowerCase().slice(1)));
}

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
  if (IS_EQUIV(course)) {
<<<<<<< HEAD
    const courseName = course.id.replace(course.no.toLowerCase(), course.no.toLowerCase().slice(1) )
=======
    const courseName = course.id.replace(course.no.toLowerCase(), course.no.toLowerCase().slice(1))
>>>>>>> 0f0c844019002b86f8797a27054631302ecdf839
    course.equivIds = course.equivIds || []
    if (!course.equivIds.includes(courseName)) {
      console.log(course.id)
      course.equivIds = [...course.equivIds, courseName];
    }
  }
});
//process.exit();
let saveString = JSON.stringify(data, null, 2);
fs.writeFileSync('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
  console.log(saveString);
})
