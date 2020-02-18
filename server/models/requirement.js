const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
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
    type: [Object], // requirement groups
    required: false,
    unqiue: false,
  },
  requirements: {
    type: [Object], // requirements
    required: false,
    unique: false,
  },
});

module.exports = mongoose.model('requirement', requirementSchema);
