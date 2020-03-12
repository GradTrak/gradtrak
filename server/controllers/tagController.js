const Tag = require('../models/tag');

/**
@alert this is a completely useless function. Vestigial, if you will. even though it was actually never useful to begin with.
*/
function retriveTagByID(id) {
  return Tag.find({ id });
}

/**
queries mongo for any tag models and calls successCallback on what is returned
*/
function queryTags() {
  return Tag.find();
}

module.exports.getTags = (req, res) => {
  queryTags().then((tags) => res.json(tags));
};
