const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Requirement = require('../models/requirement.model');

const requirementSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: false,
    unqiue: false,
  },
  parentId: {
    type: String,
    required: false,
    unqiue: false,
  },
  requirementCategories: {
    type: [Requirement],
    required: false,
    unqiue: false,
  },
  requirements: {
    type: [Requirement],
    required: false,
    unique: false,
  }
})

module.exports = mongoose.model('requirement', requirementSchema)
