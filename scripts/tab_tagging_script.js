const data = require('./dummy/berkeleyTime.json');
const fs = require('fs');
const hasNumber = /\d/g;
const nonAlphanumeric = /[^a-zA-Z0-9]/;



//INPUTS
const MY_FILE = './tagging_lists/datasci_comp.txt'; //change to whatever
const TAG = 'data_sci_compute';



var eligibleCourses = fs.readFileSync(MY_FILE).toString()
eligibleCourses = eligibleCourses.split('\n')
eligibleCourses = eligibleCourses.map(line => line.split('\t')[0].split(' / ').join('/'));
eligibleCourses = eligibleCourses.flatMap(courses => {
  const splitCourses = courses.split('/');
  if (splitCourses.length === 1) {
    return splitCourses;
  }
  if (hasNumber.test(splitCourses[0])) { //COMPSCI C100/DATA C100
    return splitCourses;
  }
  else { //COMPSCI/DATA/STAT C100
    //TODO
  }
});
eligibleCourses = eligibleCourses.filter(a=>a)
eligibleCourses = eligibleCourses.flatMap(courseId => courseId.replace(nonAlphanumeric, '').toLowerCase());
//console.log(eligibleCourses);
//process.exit(1)
data.forEach((course) => {
  if (eligibleCourses.includes(course.id.toLowerCase())) {
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
