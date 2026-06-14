import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { NotificationStore } from '../state/notification.store';
import { ThemeService } from './theme.service';
import { MainToolbar } from './main-toolbar';

async function setup() {
  const { fixture } = await render(MainToolbar, {
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      NotificationStore,
    ],
  });
  const component = fixture.debugElement.componentInstance as MainToolbar;
  const themeService = fixture.debugElement.injector.get(ThemeService);
  return { fixture, component, themeService };
}

describe('MainToolbar', () => {
  beforeEach(() => localStorage.clear());

  it('should create', async () => {
    await setup();
    expect(screen.getByTestId('lib-main-toolbar')).toBeTruthy();
  });

  it('shows sun-moon icon and system tooltip by default', async () => {
    const { component } = await setup();
    expect(component.themeTooltip()).toContain('System');
  });

  it('shows sun icon and light tooltip when theme is light', async () => {
    const { component, themeService, fixture } = await setup();
    themeService.setTheme('light');
    fixture.detectChanges();
    expect(component.themeTooltip()).toContain('Light');
  });

  it('shows moon icon and dark tooltip when theme is dark', async () => {
    const { component, themeService, fixture } = await setup();
    themeService.setTheme('dark');
    fixture.detectChanges();
    expect(component.themeTooltip()).toContain('Dark');
  });
});
