import { AncillaryServices } from './ancillary-services.model';

export class Passenger {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  bagCount?: number;
  passportNumber?: string;
  address?: string;
  dob?: Date;
  bookingPNR: string;
  wheelChair: boolean;
  flightId: number;
  seatNumber: string;
  withInfant: boolean;
  ancillaryServices?: AncillaryServices;
  checkedIn: boolean;
  boarded: boolean;
}
