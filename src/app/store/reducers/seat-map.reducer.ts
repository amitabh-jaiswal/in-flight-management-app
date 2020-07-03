import { initialSeatMapState, SeatMapState } from '../state/seat-map.state';
import { SeatMapActions, SeatMapAction } from '../actions/seat-map.action';

export const seatMapReducer = (state = initialSeatMapState, action: SeatMapActions): SeatMapState => {
  switch (action.type) {
    case SeatMapAction.CLEAR_FLIGHT_SEAT_MAP:
      return {
        ...state,
        seatMap: null
      };
    case SeatMapAction.ASSIGN_FLIGHT_SEATMAP:
      return {
        ...state,
        seatMap: action.payload
      };
    default:
      return state;
  }
};
