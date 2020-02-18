const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost/gradtrak';

module.exports.connect = (done) => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(error);
    if (done) {
      done(err);
    }
  });

  db.once('open', () => {
    console.log('MongoDB connected');
    if (done) {
      done(null, db);
    }
  });
};
