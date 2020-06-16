const Tag = require('../models/tag');

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
async function queryTags() {
  return Tag.find();
}

module.exports.getTags = async (req, res) => {
  res.json(await queryTags());
};
