import { Passenger } from './passenger.model';

export class Seat {
  seatLetter: string;
  rowNumber: number;
  windowSeat: boolean;
  aisleToTheLeft: boolean;
  aisleToTheRight: boolean;
  validSeat: boolean;
  available: boolean;
  exitRow: boolean;
  bassinet: boolean;
  passengerCheckedIn: boolean;
  passengerWithInfant: boolean;
  passengerWithWheelChair: boolean;
  passengersWithSpecialMeals: boolean;
  passenger?: Passenger;
  passengerId: number;
  seatNumber: string;
}
