//DO NOT COMMIT.


const data = require('./dummy/requirement.json');
const fs = require('fs')
const COUNTS = (req) => {
  return req.type && req.type === 'multi' && req.numRequired === 1;
}

const convert = (req) => {
  if (COUNTS(req)) {
    console.log(req.id);
    req.type = 'poly'
    //req.hidden = true //TODO remove when we fix 
  }
  if (req.requirements) {
    if (!req.requirements.some((child) => child.requirements)) {
      req.hidden = true,
      console.log('\thidden');
    }
    req.requirements.forEach((children) => {
      convert(children)
    });
  }
}

data.forEach(set => {
  set.requirementCategories.forEach((category) => {
    category.requirements.forEach((req) => {
      convert(req)
    });

  });

});
//process.exit();
let saveString = JSON.stringify(data, null, 2);
fs.writeFileSync('dummy/requirement.json', saveString, (error) => {
  if (error) {
    console.error(error)
  }
  //console.log(saveString);
})
