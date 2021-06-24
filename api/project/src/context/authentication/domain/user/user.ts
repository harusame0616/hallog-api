import jwt, { SignOptions } from 'jsonwebtoken';
import { Email } from './email';
import { HashPassword } from './hash-password';
import { PlainPassword } from './plain-password';
import { UserId } from './user-id';

export const secret = process.env.AUTH_SECRET || 'DEVELOPMENT_SECRET';
export const algorithm = process.env.AUTH_ALGORITHM || 'HS256';

export class User {
  public readonly id: UserId;
  public email: Email;
  public hashPassword: HashPassword;

  constructor(id: UserId, email: Email, hashPassword: HashPassword) {
    this.id = id;
    this.email = email;
    this.hashPassword = hashPassword;
  }

  authenticate(email: Email, plainPassword: PlainPassword) {
    return this.email.equals(email) && this.hashPassword.compare(plainPassword);
  }

  createToken() {
    return jwt.sign(
      {
        id: this.id.value,
        email: this.email.value,
      },
      secret,
      { algorithm: process.env.AUTH_ALGORITHM } as SignOptions
    );
  }
}
