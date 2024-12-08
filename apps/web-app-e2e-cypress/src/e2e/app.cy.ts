import { getGreeting, getPageMarkdown } from '../support/app.po';

describe('web-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Nx + Angular + .NET 9.0');
  });

  it('should load home.component.md', () => {
    getPageMarkdown().should(
      'have.attr',
      'ng-reflect-src',
      '/assets/home.component.md',
    );
  });
});
