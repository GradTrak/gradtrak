let DUMMY_SEMESTER_DATA = {
  fa2019: {
    id: 'fa2019',
    name: 'Fall 2019',
    courses: [],
  },
  sp2020: {
    id: 'sp2020',
    name: 'Spring 2020',
    courses: [],
  },
  fa20: {
    id: 'fa20',
    name: 'Fall 2020',
    courses: [],
  },
  sp2021: {
    id: 'sp2021',
    name: 'Spring 2021',
    courses: [],
  },
  fa21: {
    id: 'fa21',
    name: 'Fall 2021',
    courses: [],
  },
  sp2022: {
    id: 'sp2022',
    name: 'Spring 2022',
    courses: [],
  },
  fa22: {
    id: 'fa22',
    name: 'Fall 2022',
    courses: [],
  },
  sp2023: {
    id: 'sp2023',
    name: 'Spring 2023',
    courses: [],
  },
};

let DUMMY_GOAL_DATA = [];

exports.getUserData = (req, res) => {
  res.json({
    semesters: DUMMY_SEMESTER_DATA,
    goals: DUMMY_GOAL_DATA,
  });
};

exports.setUserData = (req, res) => {
  if (req.body.goals !== null) {DUMMY_GOAL_DATA = req.body.goals};
  if (req.body.semesters !== null) {DUMMY_SEMESTER_DATA = req.body.semesters}
  res.json({
    goal: DUMMY_GOAL_DATA,
    semesters: DUMMY_SEMESTER_DATA,
  })
  console.log("stored user data");
}
