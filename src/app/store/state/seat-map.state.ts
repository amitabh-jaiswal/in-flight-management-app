import { SeatMap } from 'src/app/models/seat-map.model';

export interface SeatMapState {
  seatMap: SeatMap;
}

export const initialSeatMapState: SeatMapState = {
  seatMap: null
};
