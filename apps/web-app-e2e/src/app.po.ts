import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.id('home-title')).getText() as Promise<string>;
  }

  getPageMarkdownSrc() {
    return element(by.id('page-markdown')).getAttribute('src') as Promise<
      string
    >;
  }
}
