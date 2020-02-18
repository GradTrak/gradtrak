const Tag = require('../models/tag.model');

/**
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
@alert this is a completely useless function. Vestigial, if you will. even though it was actually never useful to begin with.
*/
function retriveTagByID(id, successCallback) {
  Tag.find({ id }, (err, tagObject) => {
    if (err) {
      return console.log(err.errmsg);
    }
    return successCallback(tagObject);
  });
}

/**
queries mongo for any tag models and calls successCallback on what is returned
@param successCallback a one-argument function which will be called when the query returns, assuming it is successful
*/
function queryTags(successCallback) {
  return Tag.find().exec((err, tagList) => {
    if (err) {
      return console.log(err.errmsg);
    }
    return successCallback(tagList);
  });
}

module.exports.retriveTagByID = retriveTagByID;
module.exports.queryTags = queryTags;
module.exports.getTags = (req, res) => {
  queryTags((tags) => res.json(tags));
};
