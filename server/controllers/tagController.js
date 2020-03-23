const Tag = require('../models/tag');

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
function queryTags() {
  return Tag.find();
}

module.exports.getTags = (req, res) => {
  queryTags().then((tags) => res.json(tags));
};
