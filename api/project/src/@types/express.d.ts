export interface AuthUser {
  id: string;
  email: string;
}
declare namespace Express {
  export interface Request {
    user: AuthUser;
  }
}
