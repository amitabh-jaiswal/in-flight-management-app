import { Notification } from '../../models/notification.model';

export interface ErrorState {
  error: Notification;
}

export const initialGlobalErrorState: ErrorState = {
  error: null
};
