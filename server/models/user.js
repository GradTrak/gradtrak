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

userSchema.methods.verifyPassword = function verifyPassword(inputPassword) {
  return this.password === inputPassword;
};

module.exports = mongoose.model('User', userSchema);
