import express from 'express';

import { RequirementSetPrototype } from 'common/prototypes/requirement-set.prototype';
import RequirementSet from '../models/requirement-set';

/**
queries mongo for any requirement models and calls successCallback on what is returned
*/
async function queryRequirements(): Promise<RequirementSetPrototype[]> {
  return RequirementSet.find({}, { _id: 0, __v: 0 });
}

export async function getRequirements(req: express.Request, res: express.Response): Promise<void> {
  res.json(await queryRequirements());
}
