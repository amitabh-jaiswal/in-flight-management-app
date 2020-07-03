import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.id('email')).getText() as Promise<string>;
  }

  getInputElement(idName: string): ElementFinder {
    return element(by.id(idName));
  }

  getByButtonText(buttonText: string): ElementFinder {
    return element(by.buttonText(buttonText));
  }

  getByXpath(xpath: string): ElementFinder {
    return element(by.xpath(xpath));
  }

  scrollWindow(webElement: ElementFinder) {
    return browser.executeScript('arguments[0].scrollIntoView();', webElement.getWebElement());
  }

  scrollXY(x: number, y: number) {
    return browser.executeScript('window.scrollTo(' + x + ',' + y + ');');
  }

}
