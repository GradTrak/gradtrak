/// <reference types="cypress" />

context('Login/Register', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('fails login with an invalid username/password', () => {
    cy.getCy('register-button').should('not.exist');
    cy.getCy('login-email').should('exist').type('danialisdumb@gmail.com');
    cy.getCy('login-password').should('exist').type('andBryanToo!');
    cy.getCy('login-button').should('exist').click();
    cy.getCy('login-error').should('equal', 'Invalid username or password');
  });

  it('logs in successfully with a valid username/password', () => {
    cy.fixture('exampleUsers').then(users => {
      const exampleUser = users[0];
      cy.task('seedUser', exampleUser);
      cy.getCy('login-email').should('exist').type(exampleUser.username);
      cy.getCy('login-password').should('exist').type(exampleUser.password);
      cy.getCy('login-button').should('exist').click();
      cy.getCy('login-modal').should('not.exist');
    });
  });
});
