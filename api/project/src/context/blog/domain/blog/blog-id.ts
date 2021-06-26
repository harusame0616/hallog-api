import { ValueObject } from '../../../share/value-object/value-object';

export class BlogId extends ValueObject<string> {
  schema(): string {
    return 'required|max:64|regex:/[a-z-]+/';
  }
}
