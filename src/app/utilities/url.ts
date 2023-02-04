import { environment } from 'src/environments/environment';

const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const BACKEND_BASE_URL = environment.baseUrl;

export const AUTH = {
  SIGN_IN_API: AUTH_BASE_URL + 'signInWithPassword',
  SIGN_UP_API: AUTH_BASE_URL + 'signUp',
  SIGN_UP_API_V2: BACKEND_BASE_URL + 'v2/auth/signup'
};

export const FLIGHT_DATA = {
  SCHEDULED_API: BACKEND_BASE_URL + 'scheduledFlights',
  FLIGHT_INFO_API: BACKEND_BASE_URL + 'flights/'
};

export const PASSENGER_DATA = {
  FLIGHT_PASSENGERS_API: BACKEND_BASE_URL + 'passengers?flightId=',
  PASSENGER_INFO_API: BACKEND_BASE_URL + 'passengers/'
};

export const ANCILLARY_DATA = {
  MEALS_API: BACKEND_BASE_URL + 'meals',
  BEVERAGES_API: BACKEND_BASE_URL + 'beverages',
  SHOPPING_ITEMS_API: BACKEND_BASE_URL + 'shoppingItems'
};

export const FLIGHT_SEAT_DATA = {
  SEAT_MAP_INFO_API: BACKEND_BASE_URL + 'seatMaps/'
};
