/// <reference types="cypress" />

context('Login/Register', () => {
  beforeEach(() => {
    cy.task('clearUsers')
    cy.task('seedUsers')
    cy.visit('/')
  });

  it('fails login with an invalid username/password', () => {
    cy.getCy('register-button').should('not.exist');
    cy.getCy('login-email').should('exist').type('danialisdumb@gmail.com');
    cy.getCy('login-password').should('exist').type('andBryanToo!');
    cy.getCy('login-button').should('exist').click();
    cy.getCy('login-error').should('have.text', 'Invalid username or password');
  });

  it('logs in successfully with a valid username/password', () => {
    cy.fixture('user-seed-logins').then(users => {
      const exampleUser = users[0];
      cy.getCy('login-email').should('exist').type(exampleUser.username);
      cy.getCy('login-password').should('exist').type(exampleUser.password);
      cy.getCy('login-button').should('exist').click();
      cy.getCy('login-modal').should('not.exist');
    });
  });
  it("fails to register when passwords don't match", () => {
    cy.getCy('open-registration-button').should('exist').click();
    cy.getCy('login-email').should('not.exist');
    cy.getCy('login-password').should('not.exist');
    cy.getCy('login-button').should('not.exist');
    cy.getCy('register-email').should('exist').type('test@example.com');
    cy.getCy('register-password').should('exist').type('password1');
    cy.getCy('register-confirm-password').should('exist').type('password2');
    cy.getCy('register-button').should('exist').click();
    cy.getCy('login-modal').should('exist');
    cy.getCy('register-error').should('have.text', "Password and confirm password fields don't match!")
  });
  it('fails to register for an account that already exists', () => {
    cy.fixture('user-seed-logins').then(users => {
      console.log(users)
      const { username, password } = users[2];
      cy.register(username, password);
      cy.getCy('login-modal').should('exist');
      cy.getCy('register-error').should('exist').should('have.text', "User with that email already exists")
    })
  })
  it('registers and walks through a setup process', () => {
    cy.task('clearUsers');
    cy.fixture('user-seed-logins').then(users => {
      const { username, password } = users[3];
      cy.register(username, password);
      cy.getCy('login-modal').should('not.exist');
      cy.get('.Initializer').should('exist');
      cy.getCy('initializer-start-year-selector').select('2021');
      cy.getCy('initializer-end-year-selector').select('2022');
      cy.getCy('summer-semester-checkbox').should('exist').click();
    })

  })
});
