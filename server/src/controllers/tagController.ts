import express from 'express';

import { TagPrototype } from 'common/prototypes/tag.prototype';
import Tag from '../models/tag';

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
async function queryTags(): Promise<TagPrototype[]> {
  return Tag.find({}, { _id: 0, __v: 0 });
}

export async function getTags(req: express.Request, res: express.Response): Promise<void> {
  res.json(await queryTags());
}
