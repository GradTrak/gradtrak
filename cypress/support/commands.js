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


Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args);
});

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
