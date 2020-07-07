const data = require('./dummy/berkeleyTime.json');
const fs = require('fs')
var techTopics = fs.readFileSync('./bioeTechTopics.txt').toString()
techTopics = techTopics.split('\n').map(line => line.split(' '))
techTopics = techTopics.map(line => (line[0] + line[1]).toLowerCase());
//console.log(techTopics);
//process.exit(1)
data.forEach((course) => {
  const no = course.no.replace(/[a-zA-Z]/, "");
  if (techTopics.includes(course.id.toLowerCase())) {
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
