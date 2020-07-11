const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './tagging_lists/' + 'fpf.txt'; //change to whatever
const processEligibleCourses = false;
const courseArr = data.map(course => course.id);
const IS_EQUIV = (course) => {
  return course.dept[0] === 'X' && course.dept!=='XMBA' ;
}
const findEquivCourses = (course) => {
  return data.filter(otherCourse => {
    return otherCourse.id !== course.id &&
      otherCourse.no === course.no &&
      otherCourse.dept.replace(/[^A-Za-z0-9]/g, '').includes(course.dept.replace(/[^A-Za-z0-9]/g, '').slice(1))
  })

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
    course.equivIds = course.equivIds || []
    const equivCourses = findEquivCourses(course).filter(equiv => !course.equivIds.includes(equiv)).map(course => course.id);
    console.log(course.id, '=>', equivCourses);
    course.equivIds = [...course.equivIds, ...equivCourses];
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
