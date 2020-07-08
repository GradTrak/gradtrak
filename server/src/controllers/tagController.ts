import Tag from '../models/tag';

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
async function queryTags() {
  return Tag.find();
}

export async function getTags(req, res) {
  res.json(await queryTags());
}
