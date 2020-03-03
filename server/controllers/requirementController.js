const RequirementSet = require('../models/requirement-set');

/**
queries mongo for any requirement models and calls successCallback on what is returned
*/
function queryRequirements() {
  return RequirementSet.find().exec();
}

module.exports.getRequirements = (req, res) => {
  queryRequirements().then((reqs) => res.json(reqs));
};

module.exports.queryRequirements = queryRequirements;
