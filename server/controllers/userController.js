const User = require('../models/user.model');
const DUMMY_SEMESTER_DATA = [
  {
    id: 'fa2019',
    name: 'Fall 2019',
    courseIds: [],
  },
  {
    id: 'sp2020',
    name: 'Spring 2020',
    courseIds: [],
  },
  {
    id: 'fa20',
    name: 'Fall 2020',
    courseIds: [],
  },
  {
    id: 'sp2021',
    name: 'Spring 2021',
    courseIds: [],
  },
  {
    id: 'fa21',
    name: 'Fall 2021',
    courseIds: [],
  },
  {
    id: 'sp2022',
    name: 'Spring 2022',
    courseIds: [],
  },
  {
    id: 'fa22',
    name: 'Fall 2022',
    courseIds: [],
  },
  {
    id: 'sp2023',
    name: 'Spring 2023',
    courseIds: [],
  },
];

const DUMMY_GOAL_DATA = [];

let userData = {
  semesters: DUMMY_SEMESTER_DATA,
  goalIds: DUMMY_GOAL_DATA,
};

exports.getUserData = (req, res) => {
  res.json(userData);
};

exports.setUserData = (req, res) => {
  userData = req.body;
  res.status(204).send();
};

//function that saves individual user data
initializeDBUsers = (updatedSem, updatedGoals)=>{
  (user = User(dataPoint);
  user.save(err, updatedGoals) => {
      if (err) {
        console.log(err.errmsg)
        return console.log("One of the goals being saved is saved already! Aborting...")};
      console.log("Goal saved successfully");
  user.save((err, updatedSem) => {
      if (err) {
        console.log(err.errmsg)
        return console.log("One of the semesters being saved is saved already! Aborting...")};
      console.log("Semester saved successfully");
    });
    return false; //find a way to make this return true only when err.
}

exports.initializeDBUsers = initializeDBUsers;
exports.getRequirements = (req, res) => {
  res.json(DUMMY_REQUIREMENT_DATA);
};
