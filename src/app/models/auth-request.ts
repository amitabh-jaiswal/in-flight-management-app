export class AuthRequest {
  email: string;
  password: string;
  returnSecureToken = true;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

}
