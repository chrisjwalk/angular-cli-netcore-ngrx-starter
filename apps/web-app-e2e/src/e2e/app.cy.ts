import { getGreeting, getPageMarkdown } from '../support/app.po';

describe('web-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Nx + Angular + .NET 7.0');
  });

  it('should load home.component.md', () => {
    getPageMarkdown().should('have.attr', 'src', '/assets/home.component.md');
  });
});
