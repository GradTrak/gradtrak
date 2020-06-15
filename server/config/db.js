const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost/gradtrak';

const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports.connect = async () => {
  await mongoose.connect(dbUrl, CONFIG);

  console.log('MongoDB connected');

  return mongoose.connection;
};
