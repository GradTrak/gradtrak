/// <reference types="cypress" />

context('Login/Register', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('fails login with an invalid username/password', () => {
    cy.get('register-button').should('not.exist');
    cy.get('login-email').should('exist').type('danialisdumb@gmail.com');
    cy.get('login-password').should('exist').type('andBryanToo!');
    cy.get('login-button').should('exist').click();
    cy.get('login-error').should('have.text', 'Invalid username or password');
  });

  it('logs in successfully with a valid username/password', () => {
    cy.fixture('exampleUsers').then(users => {
      const exampleUser = users[0];
      cy.task('seedUser', exampleUser);
      cy.get('login-email').should('exist').type(exampleUser.username);
      cy.get('login-password').should('exist').type(exampleUser.password);
      cy.get('login-button').should('exist').click();
      cy.get('login-modal').should('not.exist');
    });
  });
  it("fails to register when passwords don't match", () => {
    cy.get('open-registration-button').should('exist').click();
    cy.get('login-email').should('not.exist');
    cy.get('login-password').should('not.exist');
    cy.get('login-button').should('not.exist');
    cy.get('register-email').should('exist').type('test@example.com');
    cy.get('register-password').should('exist').type('password1');
    cy.get('register-confirm-password').should('exist').type('password2');
    cy.get('register-button').should('exist').click();
    cy.get('login-modal').should('exist');
    cy.get('register-error').should('have.text', "Password and confirm password fields don't match!")
  });
});
