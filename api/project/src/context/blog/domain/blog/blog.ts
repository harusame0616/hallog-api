import Validator from 'validatorjs';
import { ValidationError } from '../../../../error/validation-error';
import { BloggerId } from '../blogger/blogger-id';
import { BlogId } from './blog-id';

export class Blog {
  private _id: BlogId;
  private _title!: string;
  private _description!: string;
  private _ownerId!: BloggerId;

  constructor(
    id: BlogId,
    title: string,
    description: string,
    ownerId: BloggerId
  ) {
    this._id = id;
    this.title = title;
    this.description = description;
    this._ownerId = ownerId;
  }

  get id() {
    return this._id;
  }

  public get ownerId() {
    return this._ownerId;
  }

  private set ownerId(ownerId: BloggerId) {
    this._ownerId = ownerId;
  }

  get title() {
    return this._title;
  }

  set title(title: string) {
    const validation = new Validator(
      { title },
      { title: 'required|string|max:48' }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first('title') || 'unknown');
    }

    this._title = title;
  }

  get description() {
    return this._description;
  }

  set description(description: string) {
    const validation = new Validator(
      { description },
      { description: 'required|string|max:256' }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first('title') || 'unknown');
    }

    this._description = description;
  }
}
