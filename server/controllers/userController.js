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
  goals: DUMMY_GOAL_DATA,
};

exports.getUserData = (req, res) => {
  res.json(userData);
};

exports.setUserData = (req, res) => {
  userData = req.body;
  res.status(204).send();
};

//function that saves individual user data
addUser = (id, updatedSem, updatedGoals)=>{
  user = User({
    id: id,
    semesters: updatedSem,
    goals: updatedGoals,
  });
  user.save((err, updatedUser) => {
      if (err) {
        console.log(err.errmsg);
        return console.log("This user is already in the database")};
      console.log(`User '${updatedUser.id}' information saved.`);
    });
    return false; //find a way to make this return true only when err.
}

/**
queries mongo for any users models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
queryUsers = (successCallback)=>{
  return User.find().exec((err, userList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(userList);
  });
}

exports.addUser = addUser;
exports.getRequirements = (req, res) => {
  res.json(DUMMY_REQUIREMENT_DATA);
};
