const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost/gradtrak';

module.exports.connect = (done) => {
  if (!done) {
    return new Promise((resolve, reject) => {
      module.exports.connect((err, conn) => {
        if (err) {
          reject(err);
        } else {
          resolve(conn);
        }
      });
    });
  }

  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(err);
    done(err);
  });

  db.once('open', () => {
    console.log('MongoDB connected');
    done(null, db);
  });

  return null;
};
