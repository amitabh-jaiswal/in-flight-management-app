import { ApiResponse } from "./api-response.dto.model";

export interface AuthResponseV2 extends AuthTokenResponse {
  email: string;
  firstName: string;
  key: string;
  lastName: string;
  phone: number;
  uuid: string;
  roles: string[];
  metadata?: UserMetadata;
}

export interface UserMetadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime: string;
}

export interface AuthTokenResponse extends ApiResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: string;
  uid: string;
}
