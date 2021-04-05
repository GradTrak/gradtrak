/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getCy(value: string): Chainable<Element>
    getCyLike(value: string): Chainable<Element>
    register(username: string, password: string): Chainable<Element>
    initialize(startYear: number, endYear: number, goals: string[]): Chainable<Element>
    continueAsGuest(value: string): Chainable<Element>
    logIn(value: string): Chainable<Element>
    createAccount(value: string): Chainable<Element>
    addMajor(value: string): Chainable<Element>
    addCourse(value: string): Chainable<Element>
    setupBlank(value: string): Chainable<Element>
    }
}
