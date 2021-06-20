import { CustomError } from '../../../error/custom-error';
import Validator, { RegisterCallback } from 'validatorjs';
Validator.useLang('ja');

export class ValidationError extends CustomError {}

export abstract class ValueObject<TYPE> {
  public readonly value: TYPE;

  constructor(value: TYPE) {
    const name = this.constructor.name;
    const validation = new Validator(
      { [name]: value },
      { [name]: this.schema() }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first(name) || 'unknown');
    }

    this.value = value;
  }

  abstract schema(): string;
  equals(target: ValueObject<TYPE>) {
    return this.value == target.value;
  }
}
