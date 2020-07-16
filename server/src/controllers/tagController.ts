import Tag from '../models/tag';

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
async function queryTags() {
  return Tag.find({}, { _id: 0, __v: 0 });
}

export async function getTags(req, res) {
  res.json(await queryTags());
}
