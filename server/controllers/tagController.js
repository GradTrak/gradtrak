const mongooseHost = require('../mongooseHost');
db = mongooseHost.db;
const Tag = require('../models/tag.model');

const DUMMY_TAG_DATA = [
  {
    id: 'upper_div',
    name: 'Upper Division Course',
  },
  {
    id: 'ac',
    name: 'American Cultures',
  },
  {
    id: 'rc_a',
    name: 'Reading and Composition Part A',
  },
  {
    id: 'rc_b',
    name: 'Reading and Composition Part B',
  },
  {
    id: 'ls_arts',
    name: 'L&S Arts and Literature',
  },
  {
    id: 'ls_bio',
    name: 'L&S Biological Science',
  },
  {
    id: 'ls_hist',
    name: 'L&S Historical Studies',
  },
  {
    id: 'ls_inter',
    name: 'L&S International Studies',
  },
  {
    id: 'ls_philo',
    name: 'L&S Philosophy and Values',
  },
  {
    id: 'ls_phys',
    name: 'L&S Physical Science',
  },
  {
    id: 'ls_socio',
    name: 'L&S Social and Behavioral Sciences',
  },
  {
    id: 'eecs_ethics',
    name: 'EECS Ethics Course',
  },
  {
    id: 'eecs_upper_div',
    name: 'EECS Upper Division Course',
  },
  {
    id: 'linguis_elective',
    name: 'Linguistics Elective',
  },
];


initializeDBTags = ()=>{
  DUMMY_TAG_DATA.some((dataPoint)=>{
    tag = Tag(dataPoint);
    tag.save((err, course) => {
      if (err) {
        console.log(err.errmsg)
        return console.log("One of the tags being saved is saved already! Aborting...")};
      console.log("Tag saved successfully");
    });
    return false; //find a way to make this return true only when err.
  });
}

exports.initializeDBTags = initializeDBTags;

exports.getTags = (req, res) => {
  res.json(DUMMY_TAG_DATA);
};
