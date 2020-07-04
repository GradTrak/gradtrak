const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
data.forEach((course) => {
  if (course.no >= 100 && course.no <=196 && !course.title.includes('Special Topic')) {
    if (!course.tagIds.includes(course.tagIds)) {
      course.tagIds = [...course.tagIds, 'upper_div'];
    }
  }
});
const saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (err) {
    console.error(error)
  }
})
