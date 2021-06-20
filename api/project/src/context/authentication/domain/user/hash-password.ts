import bcrypt from 'bcrypt';
import { ValueObject } from '../../../share/value-object/value-object';
import { PlainPassword } from './plain-password';

const saltRound = 10;

export class HashPassword extends ValueObject<string> {
  schema() {
    return 'required|string|size:60';
  }

  static fromPlainPassword(plainPassword: PlainPassword) {
    return new HashPassword(bcrypt.hashSync(plainPassword.value, saltRound));
  }

  compare(plainPassword: PlainPassword) {
    return bcrypt.compareSync(plainPassword.value, this.value);
  }
}
