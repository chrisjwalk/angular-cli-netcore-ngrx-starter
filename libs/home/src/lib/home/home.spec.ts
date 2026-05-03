import { of } from 'rxjs';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { render, screen } from '@testing-library/angular';

import { Home } from './home';

vi.mock('@analogjs/content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@analogjs/content')>();
  return {
    ...actual,
    injectContent: () =>
      of({ filename: 'home', slug: 'home', content: '# Test', attributes: {} }),
  };
});

describe('Home', () => {
  test('should exist', async () => {
    await render(Home, {
      providers: [provideContent(withMarkdownRenderer())],
    });

    expect(screen.getByTestId('lib-home')).toBeTruthy();
  });
});
