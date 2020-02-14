const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

function verifyPassword(inputPassword) {
  return this.password === inputPassword;
};
userSchema.methods.verifyPassword = verifyPassword;

module.exports = mongoose.model('User', userSchema);
