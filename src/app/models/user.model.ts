import { AuthTokenResponse } from "./auth-response-v2.model";

export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: number;
  expiresIn: number;
  refreshToken: string;
  private _isAdmin: boolean;
  private _token: string;
  private _tokenExpirationDate: Date;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    displayName: string,
    token: string,
    tokenExpirationDate: Date,
    refereshToken: string,
    isAdmin: boolean,
    phone: number,
    expiresIn: number
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this._token = token;
    this._tokenExpirationDate = tokenExpirationDate;
    this.refreshToken = refereshToken;
    this._isAdmin = isAdmin;
    this.phone = phone;
    this.expiresIn = expiresIn;
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this._token;
  }

  get isAdmin() {
    return this._isAdmin;
  }
}

export interface LoggedInUser extends AuthTokenResponse {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  roles: string[];
}
