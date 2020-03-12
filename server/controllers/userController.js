const User = require('../models/user');

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
  goals: DUMMY_GOAL_DATA,
};

exports.getUserData = (req, res) => {
  res.json(userData);
};

exports.setUserData = (req, res) => {
  userData = req.body;
  res.status(204).send();
};
