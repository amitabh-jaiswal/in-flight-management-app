export interface AuthResponseV2 {
  email: string,
  firstName: string,
  key: string,
  lastName: string,
  phone: number,
  uuid: string,
  token: string,
  refreshToken: string,
  expiresIn: number
  roles: string[]
}
