import RequirementSet from '../models/requirement-set';

/**
queries mongo for any requirement models and calls successCallback on what is returned
*/
async function queryRequirements() {
  return RequirementSet.find({}, { _id: 0, __v: 0 });
}

export async function getRequirements(req, res) {
  res.json(await queryRequirements());
}
