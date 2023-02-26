export interface AuthRequestV2 {
  firstName: string,
  lastName: string,
  phone: number,
  password: string,
  email: string,
  roles?: string[]
}

export interface AuthTokenRequestV2 {
  grantType: 'refresh_toke' | 'password';
  email?: string;
  password?: string;
  refreshToken?: string;
}
