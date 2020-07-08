import RequirementSet from '../models/requirement-set';

/**
queries mongo for any requirement models and calls successCallback on what is returned
*/
async function queryRequirements() {
  return RequirementSet.find();
}

export async function getRequirements(req, res) {
  res.json(await queryRequirements());
}
