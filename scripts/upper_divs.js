const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
data.forEach((course) => {
  const no = course.no.replace(/[^0-9\.]+/g, "");
  if (no >= 100 && no <=196 && course.dept === 'ECON') {
    if (!course.tagIds.includes(course.tagIds)) {
      course.tagIds = [...course.tagIds, 'economics_upper_div'];
    }
  }
});
const saveString = JSON.stringify(data, null, 2);
fs.writeFile('dummy/berkeleyTime.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
})
