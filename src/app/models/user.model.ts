export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: number;
  private _isAdmin: boolean;
  private _token: string;
  private _tokenExpirationDate: Date;
  private _refereshToken: string;

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
    phone: number
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this._token = token;
    this._tokenExpirationDate = tokenExpirationDate;
    this._refereshToken = refereshToken;
    this._isAdmin = isAdmin;
    this.phone = phone;
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this._token;
  }

  get refereshToken() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return this._refereshToken;
    return null;
  }

  get isAdmin() {
    return this._isAdmin;
  }

}
