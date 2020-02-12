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

initializeDBTags = () => {
  DUMMY_TAG_DATA.some((dataPoint) => {
    tag = Tag(dataPoint);
    tag.save((err, course) => {
      if (err) {
        console.log(err.errmsg);
        return console.log('One of the tags being saved is saved already! Aborting...');
      }
      console.log('Tag saved successfully');
    });
    return false; // find a way to make this return true only when err.
  });
};

/**
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
@alert this is a completely useless function. Vestigial, if you will. even though it was actually never useful to begin with.
*/
retriveTagByID = (id, successCallback) => {
  Tag.find({ id }, (err, tagObject) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(tagObject);
  });
};

/**
queries mongo for any tag models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
queryTags = (successCallback) => {
  return Tag.find().exec((err, tagList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(tagList);
  });
};

exports.initializeDBTags = initializeDBTags;
exports.retriveTagByID = retriveTagByID;
exports.queryTags = queryTags;
exports.getTags = (req, res) => {
  queryTags((tags) => res.json(tags));
  // res.json(DUMMY_TAG_DATA);
};
