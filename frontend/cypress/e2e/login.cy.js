describe('Login page', () => {
  it('should display the login form', () => {
    cy.visit('/')
    cy.contains('Iniciar Sesión')
    cy.get('input[type=email]').should('exist')
    cy.get('input[type=password]').should('exist')
  })
})
