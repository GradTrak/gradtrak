// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'


import User from '../../server/models/user';
import Tag from '../../server/models/tag';
import RequirementSet from '../../server/models/requirement-set';
import Course from '../../server/models/course';
// Alternatively you can use CommonJS syntax:
// require('./commands')


// A single time before running the first test, reset database
before(() => {
  cy.fixture('courses').then((courses) => {
    Course.deleteMany({}).then(() => {
      Course.insertMany(courses);
    });
  })
  cy.fixture('tags').then((tags) => {
    Tag.deleteMany({}).then(() => {
      Tag.insertMany(tags);
    });
  })
  cy.fixture('requirement-sets').then((reqSets) => {
    RequirementSet.deleteMany({}).then(() => {
      RequirementSet.insertMany(reqSets);
    });
  })
  User.deleteMany({});
})
