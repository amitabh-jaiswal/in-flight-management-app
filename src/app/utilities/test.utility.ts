import { Flight } from '../models/flight.model';
import { AncillaryServices } from '../models/ancillary-services.model';
import { User } from '../models/user.model';
import { ServiceDetail } from '../models/service-detail.model';
import { Passenger } from '../models/passenger.model';
import { SeatMap } from '../models/seat-map.model';
import { SeatRow } from '../models/seat-row.model';
import { ScheduledFlight } from '../models/scheduled-flight.model';

export class TestUtility {

  constructor() { }

  static setupFlightData(): Flight {
    const flightInfo = new Flight();
    flightInfo.id = '2345';
    flightInfo.ancillaryServices = new AncillaryServices();
    flightInfo.ancillaryServices.beverages = [456217, 233];
    flightInfo.ancillaryServices.meals = [456217, 230];
    flightInfo.ancillaryServices.shoppingItems = [456217];
    flightInfo.arrScheduled = new Date();
    flightInfo.depScheduled = new Date();
    flightInfo.arrivalAirport = {
      id: '1234122',
      code: 'BLR',
      name: 'Kempegowda International Airport',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      terminal: 'T1',
      gate: 8
    };
    flightInfo.departureAirport = {
      id: '1234122',
      code: 'BLR',
      name: 'Kempegowda International Airport',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      terminal: 'T1',
      gate: 8
    };
    flightInfo.flightNumber = 34324;
    flightInfo.seatMapId = 34242;
    return flightInfo;
  }

  static setUpUserData(isAdmin?: boolean): User {
    return new User('fsagsydasuydad', 'test@jasmine.com', '', '', '',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzZjI3NjU0MmJmZmU0NWU5OGMyMGQ2MDNlYmUyYmExMTc2ZWRhMzMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmxpZ2h0LW1hbmFnZW1lbnQtMTQ4ZWQiLCJhdWQiOiJmbGlnaHQtbWFuYWdlbWVudC0xNDhlZCIsImF1dGhfdGltZSI6MTU5MjgzMjI0NywidXNlcl9pZCI6ImpEY3RPVTlmQlJlckVyNnBzU3BXTnZ6MEdXVDIiLCJzdWIiOiJqRGN0T1U5ZkJSZXJFcjZwc1NwV052ejBHV1QyIiwiaWF0IjoxNTkyODMyMjQ3LCJleHAiOjE1OTI4MzU4NDcsImVtYWlsIjoidGVzdEBnb2NyYWZ0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QGdvY3JhZnQuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Tq53p8LtlUeHp2AsG8AwTX7g6WdAcP8_ufoDh1itu_TEgwYEN3TnCsjNSwv45l6R2CnboI1eNjuoIscALcrWpAmb9sVKpt7A-3Dkc7Fue7kGCjN4MBoF85HV9fPQv0hT4uUzS_CgUgHq-md6WJWr_T4PxTSE9sTwQNJzYsb8xnEDaM9XqswRCRgBaEG0JQ2UAzrq8zrBALM6XFXnc8mC1GzEj81LOKupjMBHs4gNN4vQnhgfYzV33zXY0u7E3ETPhkPj8U40zLmxZpfKkbH13_JPgDcpsQzMQdf7iwD6kjB04IVX2fcbCqwRKwQGk-gcONKT_N5Y8wT2tT39jpoltA',
      new Date(), '', isAdmin ? true : false);
  }

  static setUpServiceData(randomId?: boolean, isSelected?: boolean): ServiceDetail {
    const serviceDetail = new ServiceDetail();
    serviceDetail.category = 'VEG';
    serviceDetail.currency = 'INR';
    serviceDetail.id = randomId ? Math.round(Math.random() * 10000000) : 456217;
    serviceDetail.image = 'image';
    serviceDetail.mealName = 'meal name';
    serviceDetail.price = '345';
    serviceDetail.isSelected = isSelected ? true : false;
    return serviceDetail;
  }

  static setUpPassengerData(seatNumber?: string, checkInStatus?: boolean, dob?: Date, passport?: string, address?: string): Passenger {
    const passenger = new Passenger();
    passenger.id = 123456;
    passenger.firstName = 'ABC';
    passenger.lastName = 'XYZ';
    passenger.bookingPNR = 'HSJ78H';
    passenger.dob = dob ? dob : new Date(1997, 6, 18);
    passenger.flightId = 72180912;
    passenger.gender = 'M';
    passenger.seatNumber = seatNumber ? seatNumber : '1A';
    passenger.address = address ? address : 'ADDRESS';
    passenger.passportNumber = passport ? passport : 'BSKA78';
    passenger.ancillaryServices = {
      beverages: [456217],
      meals: [456217],
      shoppingItems: [456217]
    };
    passenger.checkedIn = checkInStatus ? true : false;
    return passenger;
  }

  static setUpseatMap(): SeatMap {
    const seatMap = new SeatMap();
    seatMap.id = Math.random();
    seatMap.flightNumber = 456789;
    seatMap.cabins = [
      {
        cabinClass: 'J',
        seatRows: [
          {
            rowNumber: 1,
            exitRow: false,
            maximumOfSeats: 6,
            overWingRow: false,
            seatConfiguration: '3,3',
            seatConfigurationLetters: 'ABC,DEF',
            seats: [
              {
                aisleToTheLeft: false,
                aisleToTheRight: false,
                available: true,
                bassinet: true,
                exitRow: false,
                passengerCheckedIn: true,
                passengerId: 123456,
                passengerWithInfant: true,
                passengerWithWheelChair: false,
                passengersWithSpecialMeals: false,
                rowNumber: 1,
                validSeat: true,
                windowSeat: true,
                seatLetter: 'A',
                seatNumber: '1A'
              },
              {
                aisleToTheLeft: false,
                aisleToTheRight: false,
                available: true,
                bassinet: true,
                exitRow: false,
                passengerCheckedIn: true,
                passengerId: null,
                passengerWithInfant: true,
                passengerWithWheelChair: false,
                passengersWithSpecialMeals: false,
                rowNumber: 1,
                validSeat: true,
                windowSeat: true,
                seatLetter: 'A',
                seatNumber: '1B'
              }
            ]
          }
        ]
      }
    ];
    return seatMap;
  }

  static setupScheduledFlightData(): ScheduledFlight {
    const flightData = new ScheduledFlight();
    flightData.arrCode = 'XYZ';
    flightData.depCode = 'ABC';
    flightData.departScheduled = new Date().toString();
    flightData.flightId = Math.random();
    flightData.flightNumber = 3345;
    flightData.operatingAirline = 'WS';
    return flightData;
  }

}
