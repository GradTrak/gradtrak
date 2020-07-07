const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
const MY_FILE = './bioeeligibleCourses.txt'; //change to whatever
const TAG_TO_DELETE = 'ugba_upper_div',

data.forEach((course) => {
  course.tagIds = course.tagIds.filter(tagId => tagid !== TAG_TO_DELETE);
});
const saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
})
