import { randomUUID } from 'crypto';
import { ValueObject } from './value-object';

export class ID extends ValueObject<string> {
  constructor(id: string) {
    super(id);
  }

  static createWithNewId() {
    return new ID(randomUUID());
  }

  schema(): string {
    return 'required|regex:/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i';
  }
}
