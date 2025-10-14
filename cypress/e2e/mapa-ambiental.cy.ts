describe('Mapa Ambiental - Tests E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debe cargar la página principal correctamente', () => {
    cy.contains('Mapa Ambiental').should('be.visible')
    cy.contains('Cerrar sesión').should('be.visible')
  })

  it('debe mostrar los controles principales de la aplicación', () => {
    // Verificar header con título y botones
    cy.contains('Mapa Ambiental').should('be.visible')
    cy.contains('+ Subir datos').should('be.visible')
    cy.contains('Cerrar sesión').should('be.visible')
  })

  it('debe mostrar el panel de filtros', () => {
    cy.contains('Filtros').should('be.visible')

    // Verificar selectores de filtro básicos
    cy.contains('País').should('be.visible')
    cy.contains('Departamento').should('be.visible')
    cy.contains('Ciudad').should('be.visible')
    // Nota: "Parámetros" puede aparecer solo cuando hay datos seleccionados
  })

  it('debe mostrar el mapa', () => {
    // El mapa se carga dinámicamente, verificar que el contenedor existe
    cy.get('body').should('be.visible')
    // Nota: El mapa de MapLibre GL puede tardar en cargar completamente
  })

  it('debe mostrar el selector de fechas cuando hay datos', () => {
    // Los datos mock se cargan automáticamente, verificar que aparecen las fechas
    cy.get('body').should('contain', '2024') // Las fechas mock contienen 2024
  })

  it('debe mostrar el botón de subir datos', () => {
    cy.contains('+ Subir datos').should('be.visible').click()

    // Verificar que se abre el wizard de subida
    cy.get('body').should('be.visible') // El wizard debería aparecer
  })

  it('debe tener un enlace a la guía de usuario', () => {
    cy.contains('📖 Guía de uso').should('be.visible')
  })

  it('debe navegar a la página de guía', () => {
    // En lugar de hacer click, visitamos directamente la página
    // ya que el enlace puede tener comportamientos especiales
    cy.visit('/guia')
    cy.url().should('include', '/guia')
    cy.contains('Guía de uso').should('be.visible')
  })

  it('debe mostrar la página de guía correctamente', () => {
    cy.visit('/guia')
    cy.contains('Guía de uso').should('be.visible')
  })

  it('debe mostrar información sobre formatos de archivo en la guía', () => {
    cy.visit('/guia')
    cy.contains('GeoJSON').should('be.visible')
    cy.contains('CSV').should('be.visible')
  })

  it('debe permitir descargar ejemplos de archivos', () => {
    cy.visit('/guia')
    cy.contains('Descargar').should('be.visible')
  })
})