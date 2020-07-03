import { AppPage } from './app.po';
import { browser, logging, Key, ElementFinder, ElementArrayFinder, WebElementPromise } from 'protractor';
import { XPath } from './constants/xpath.enum';

describe('workspace-project App', () => {
  let page: AppPage;
  const WAIT = 5000;

  beforeEach(() => {
    page = new AppPage();
    browser.manage().window().maximize();
  });

  it('should login successfully', async () => {
    page.navigateTo();
    await browser.waitForAngularEnabled(false);
    await browser.sleep(5000);
    await page.getInputElement('email').sendKeys('test@gocraft.com');
    await browser.driver.sleep(2000);
    await page.getInputElement('password').sendKeys('password1234');
    await browser.driver.sleep(2000);
    await page.getByButtonText('Login').sendKeys(Key.ENTER);
    await browser.sleep(5000);
    const url = await browser.driver.getCurrentUrl();
    expect(url).toContain('/flight');
  });

  it('should select scheduled flight', async () => {
    await page.getByXpath(XPath.SCHEDULED_FLIGHT_SELECT_INPUT).click();
    await browser.sleep(2000);
    await page.getByXpath(XPath.SCHEDULED_FLIGHT_OPTION).click();
    await browser.sleep(4000);
    const content = await page.getByXpath(XPath.SELECTED_SCHEDULED_FLIGHT_VALUE);
    expect(content).toBeTruthy();
  });

  it('should select the seat of the passenger', async () => {
    await page.scrollWindow(await page.getByXpath(XPath.FLIGHT_DETAILS_GATE));
    const seat: ElementFinder = await page.getByXpath(XPath.FLIGHT_SEAT);
    browser.sleep(WAIT);
    const confirmSeatStatus = (await seat.getAttribute('class')).includes('not-checked-in') ? 'checked-in' : 'not-checked-in';
    await seat.click();
    await browser.sleep(3000);
    expect(await page.getByXpath(XPath.BOTTOM_SHEET).isPresent()).toBeTruthy();
    await page.getByXpath(XPath.CHECKIN_UNDO_CHECKIN_BUTTON).click();
    await browser.sleep(WAIT);
    const result = await (await page.getByXpath(XPath.FLIGHT_SEAT).getAttribute('class')).includes(confirmSeatStatus);
    await browser.sleep(WAIT);
    expect(result).toBeTruthy();
  });

  it('should go to passenger details page', async () => {
    await page.getByXpath(XPath.FLIGHT_SEAT).click();
    browser.sleep(WAIT);
    await page.getByXpath(XPath.VIEW_PASSENGER_DETAILS_BUTTON).click();
    browser.sleep(WAIT);
    const url = await browser.getCurrentUrl();
    expect(url).toContain('/flight/passengers/');
  });

  // it('should add the services in the passenger', async () => {
  //   const meals: ElementFinder = await page.getByXpath(XPath.TOTAL_MEAL_CARDS);
  //   const beverages = await page.getByXpath(XPath.TOTAL_BEVERAGE_CARDS);
  //   const items = await page.getByXpath(XPath.TOTAL_ITEM_CARDS);
  //   // console.log(beverages);
  //   // console.log(items);
  // });

  it('should logout successfully', async () => {
    await page.getByXpath(XPath.LOGOUT).click();
    const url = await browser.driver.getCurrentUrl();
    await browser.sleep(WAIT);
    expect(url).toContain('/login');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
