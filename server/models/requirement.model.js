const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: [String],//ids of requirement groups
    required: false,
    unqiue: false,
  },
  requirements: {
    type: [String],//ids of requirements
    required: false,
    unique: false,
  }
})

module.exports = mongoose.model('requirement', requirementSchema)
