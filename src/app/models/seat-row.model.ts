import { Seat } from './seat.model';

export class SeatRow {
  maximumOfSeats: number;
  rowNumber: number;
  exitRow: boolean;
  overWingRow: boolean;
  seatConfiguration: string;
  seatConfigurationLetters: string;
  seats: Seat[];
}
