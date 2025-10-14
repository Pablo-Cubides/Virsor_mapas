// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<void>
      waitForMap(): Chainable<void>
      selectFilters(pais: string, departamento: string, ciudad: string): Chainable<void>
    }
  }
}

// Custom command para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Custom command para verificar que el mapa está cargado
Cypress.Commands.add('waitForMap', () => {
  cy.get('[data-testid="map-container"]', { timeout: 10000 }).should('be.visible')
})

// Custom command para seleccionar filtros
Cypress.Commands.add('selectFilters', (pais: string, departamento: string, ciudad: string) => {
  cy.get('select[aria-label*="País"]').select(pais)
  cy.get('select[aria-label*="Departamento"]').select(departamento)
  cy.get('select[aria-label*="Ciudad"]').select(ciudad)
})

export {}