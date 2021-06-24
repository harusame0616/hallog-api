import { ValueObject } from '../../../share/value-object/value-object';

export class Nickname extends ValueObject<string> {
  schema(): string {
    return 'required|string|between:1,24';
  }
}
