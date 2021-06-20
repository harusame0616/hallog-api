import { ValueObject } from '../../../share/value-object/value-object';

export class Email extends ValueObject<string> {
  schema(): string {
    return 'required|email';
  }
}
