const Requirement = require('../models/requirement.model');

/**
queries mongo for any requirement models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
const queryRequirements = (successCallback) => {
  return Requirement.find().exec((err, requirementList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(requirementList);
  });
};

exports.getRequirements = (req, res) => {
  queryRequirements((reqs) => res.json(reqs));
  // res.json(DUMMY_REQUIREMENT_DATA);
};
