import { EmailMode } from "./email-mode.enum";

export interface SendEmailApiResponse {
  message: string
}

export interface ConfirmResetPasswordResponse {
  message?: string;
  email?: string;
  mode?: EmailMode;
}

export enum OtpType {
  UPDATE_PASSWORD = 'update-password'
}
