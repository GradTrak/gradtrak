/// <reference path="./index.d.ts" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


/**
 * Logs in with the given email and password. Assumes that you're
 * on the login modal.
 */
Cypress.Commands.add('login', (email, password) => {

});

/**
 * Registers a user with the given email and password. Assumes
 * that you're on the register part of the login modal.
 */
Cypress.Commands.add('register', (email, password) => {
  cy.get('open-registration-button').should('exist').click();
  cy.get('register-email').should('exist').type(email);
  cy.get('register-password').should('exist').type(password);
  cy.get('register-confirm-password').should('exist').type(password);
})
/**
 * Continue as guest without logging in
 */
Cypress.Commands.add('continueAsGuest', () => {

});

Cypress.Commands.add('logIn', (username, password) => {

});

Cypress.Commands.add('createAccount', (username, password) => {

})

Cypress.Commands.add('addMajor', (major) => {

});

Cypress.Commands.add('addCourse', (year, season) => {

});

Cypress.Commands.add('setupBlank', () => {
  cy.createAccount('');
})
