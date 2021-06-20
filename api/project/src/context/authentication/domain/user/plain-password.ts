import { ValueObject } from '../../../share/value-object/value-object';

export class PlainPassword extends ValueObject<string> {
  schema() {
    return 'required|string|between:8,48';
  }
}
