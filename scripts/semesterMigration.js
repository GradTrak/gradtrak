const Course = require('../server/models/course');
const RequirementSet = require('../server/models/requirement-set');
const Tag = require('../server/models/tag');
const User = require('../server/models/user');

const db = require('../server/config/db');
db.connect()
  .then((c) => {
    //TODO: Query everything and then modify their semesters and then dump it back in. 
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    conn.close();
    cache.del('*', (err, deleted) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Cache flushed: ${deleted} keys deleted`);
      }
      cache.client.quit();
    });
  });
