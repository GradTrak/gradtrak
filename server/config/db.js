const mongoose = require('mongoose');

const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost/gradtrak';

module.exports.connect = () => {
  mongoose.connect(dbUrl, CONFIG);
};
