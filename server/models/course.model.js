const mongoose = require('mongoose')
const Schema = mongoose.Schema()

const courseSchema = Schema({
  id: {
    type: string.
    required: true,
    unique: true,
  },
  dept: {
    type: string.
    required: true,
    unique: true,
  },
  no: {
    type: string.
    required: true,
    unique: true,
  },
  title: {
    type: string.
    required: true,
    unique: true,
  },
  units: {
    type: number.
    required: true,
  },
  tags: Array
})

module.exports = mongoose.model('course', courseSchema)
