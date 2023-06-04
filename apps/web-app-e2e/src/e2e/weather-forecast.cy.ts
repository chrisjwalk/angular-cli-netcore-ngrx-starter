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
    cy.get('[data-cy="table-row"]').should('have.length', 10);
  });
});
