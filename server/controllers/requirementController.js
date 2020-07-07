const RequirementSet = require('../models/requirement-set');

/**
queries mongo for any requirement models and calls successCallback on what is returned
*/
async function queryRequirements() {
  return RequirementSet.find();
}

module.exports.getRequirements = async (req, res) => {
  res.json(await queryRequirements());
};
