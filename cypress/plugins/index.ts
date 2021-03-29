import fs from 'fs'
import * as db from '../../build/server/config/db';
import Tag from '../../src/server/models/tag';
import RequirementSet from '../../src/server/models/requirement-set';
import Course from '../../src/server/models/course';
import User from '../../build/server/models/user';

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */


db.connect();


module.exports = (on, config) => {

  const webpackPreprocessor = require('@cypress/webpack-preprocessor');
  module.exports = (on) => {
      on('file:preprocessor', webpackPreprocessor());
  }

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // Usage: cy.task('seedUsers')
  on('task', {
    'setupDatabase': async () => {
      await Tag.deleteMany({}).then(() => {
        const items = require('../fixtures/tags');
        Tag.insertMany(items);
      });
      await Course.deleteMany({}).then(() => {
        const items = require('../fixtures/courses');
        items.forEach((course) => {course.berkeleytimeData.berkeleytimeId = course.berkeleytimeData.berkeleytimeId || 'something'})
        Course.insertMany(items);
      });
      await RequirementSet.deleteMany({}).then(() => {
        const items = require('../fixtures/requirement-sets');
        RequirementSet.insertMany(items);
      });
      return null;
    }
  });

  on('task', {
    'clearUsers': async () => {
      return await User.deleteMany({});
    }
  });

  on('task', {
    'seedUsers': async () => {
      return await User.insertMany(require('../fixtures/user-seed'));
    }
  });


}
