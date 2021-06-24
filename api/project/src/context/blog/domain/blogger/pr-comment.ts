import {
  ValidationError,
  ValueObject,
} from '../../../share/value-object/value-object';

export class PrComment extends ValueObject<string> {
  constructor(value: string) {
    if (value == undefined || value == null) {
      throw new ValidationError('PrCommentは必須です');
    }

    super(value);
  }
  schema(): string {
    return 'string|max:2048';
  }
}
