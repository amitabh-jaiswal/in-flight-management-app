export interface AuthRequestV2 {
  firstName: string,
  lastName: string,
  phone: number,
  password: string,
  email: string,
  roles?: string[]
}
