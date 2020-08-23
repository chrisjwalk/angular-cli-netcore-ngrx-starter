import { getGreeting, getPageMarkdown } from '../support/app.po';

describe('web-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Nx + Angular + NgRx Platform + .NET Core 3.1');
  });

  it('should load home.component.md', () => {
    getPageMarkdown().should('have.attr', 'src', '/assets/home.component.md');
  });
});
