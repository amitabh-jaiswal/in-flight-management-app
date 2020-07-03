export enum XPath {
  SCHEDULED_FLIGHT_SELECT_INPUT = '//div[contains(@class,"mat-select-arrow-wrappe")]/div',
  SCHEDULED_FLIGHT_OPTION = '//*[@id="mat-option-1"]',
  SELECTED_SCHEDULED_FLIGHT_VALUE = '//span[text()="WS - 1134  BLR TO LKO ( Wednesday, June 10, 2020 )"]',
  FLIGHT_DETAILS_GATE = '//p[contains(text(),"Gate")]',
  FLIGHT_SEAT = '//mat-icon[@ng-reflect-message="1A"]',
  BOTTOM_SHEET = '//mat-bottom-sheet-container[@role="dialog"]',
  CHECKIN_UNDO_CHECKIN_BUTTON = '//span[contains(text(),"Check In")]',
  VIEW_PASSENGER_DETAILS_BUTTON = '//span[@class="mat-button-wrapper" and text()="View Passenger Details"]',
  TOTAL_MEAL_CARDS = '//mat-card-header/div[@class="mat-card-header-text"]/mat-card-title[@class="mat-card-title"]/h1[text()="Meals"]/../../../../mat-card-content[@class="mat-card-content"]/div[contains(@class,"row")]/div[contains(@class,"col-sm-3 col-6")]',
  TOTAL_BEVERAGE_CARDS = '//mat-card-header/div[@class="mat-card-header-text"]/mat-card-title[@class="mat-card-title"]/h1[text()="Beverages"]/../../../../mat-card-content[@class="mat-card-content"]/div[contains(@class,"row")]/div[contains(@class,"col-sm-3 col-6")]',
  TOTAL_ITEM_CARDS = '//mat-card-header/div[@class="mat-card-header-text"]/mat-card-title[@class="mat-card-title"]/h1[text()="Shopping Items"]/../../../../mat-card-content[@class="mat-card-content"]/div[contains(@class,"row")]/div[contains(@class,"col-sm-3 col-6")]',
  LOGOUT = '//*[@ng-reflect-router-link-active="active-toolbar"]//span[@class="mat-button-wrapper"]//span[text()="Logout"]'
}
