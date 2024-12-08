describe('weather-forecast', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/weatherforecasts*',
      Array(10)
        .fill(null)
        .map((d, i) => ({
          id: i,
          dateFormatted: i,
          temperatureC: i,
          temperatureF: i,
          summary: 'Test',
        })),
    ).as('getWeatherforecasts');
    cy.visit('/weather-forecast');
  });

  it('should display 10 rows', () => {
    cy.wait('@getWeatherforecasts');
    cy.get('[data-testid="table-row"]').should('have.length', 10);
  });

  it('should have correct title', () => {
    cy.title().should('eq', 'Weather Forecasts | Demo App');
  });
});
