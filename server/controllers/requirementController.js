const RequirementSet = require('../models/requirement-set');

/**
queries mongo for any requirement models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
function queryRequirements(successCallback) {
  return Requirement.find().exec((err, requirementList) => {
    if (err) {
      console.log(err.errmsg);
    }
    successCallback(requirementList);
  });
}

module.exports.getRequirements = (req, res) => {
  queryRequirements((reqs) => res.json(reqs));
};

module.exports.queryRequirements = queryRequirements;
