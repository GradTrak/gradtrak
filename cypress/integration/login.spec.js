/// <reference types="cypress" />

context('Login/Register', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('fails login with an invalid username/password', () => {
    cy.getBySel('register-button').should('not.exist');
    cy.getBySel('login-email').should('exist').type('danialisdumb@gmail.com');
    cy.getBySel('login-password').should('exist').type('andBryanToo!');
    cy.getBySel('login-button').should('exist').click();
    cy.getBySel('login-error').should('equal', 'Invalid username or password');
  });

  it('logs in successfully with a valid username/password', () => {
    cy.fixture('exampleUsers')
    cy.task('seedUser')
  })
