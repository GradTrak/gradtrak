const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost/gradtrak';

module.exports.connect = () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(error);
  });

  db.once('open', () => {
    console.log('MongoDB connected');
  });
};
