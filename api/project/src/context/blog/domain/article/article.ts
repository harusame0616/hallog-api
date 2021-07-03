import Validator from 'validatorjs';
import { DuplicationError } from '../../../../error/duplication-error';
import { OverflowError } from '../../../../error/overflow-error';
import { ValidationError } from '../../../../error/validation-error';
import { getCurrentDatetime } from '../../../../helper/datetime-helper';
import { BlogId } from '../blog/blog-id';
import { ArticleId } from './article-id';

const ErrorMessage = {
  tagCountIsOverflow: 'タグの最大数を超えています',
  tagIsDuplicated: 'タグが重複しています',
  publicStatusIsInvalid: '公開設定はtrue/falseで指定してください',
};

export class Article {
  protected readonly _id: ArticleId;
  protected _blogId: BlogId;
  protected _title!: string;
  protected _content!: string;
  protected _tags: string[] = [];
  protected _isPublic!: boolean;
  protected _createdAt: Date;
  protected _updateAt: Date;
  readonly maxTagConut = 10;

  constructor(
    id: ArticleId,
    blogId: BlogId,
    title: string,
    content: string,
    tags: string[],
    isPublic: boolean,
    createdAt: Date,
    updateAt: Date
  ) {
    this._id = id;
    this._blogId = blogId;

    const validation = new Validator(
      { createdAt, updateAt },
      { createdAt: 'required|date', updateAt: 'required|date' }
    );
    if (validation.fails()) {
      throw new ValidationError(validation.errors.all()[0] || 'unknown');
    }

    this.changeTitle(title);
    this.changeContent(content);
    this.setTags(tags);

    if (isPublic === true) {
      this.publish();
    } else if (isPublic === false) {
      this.hide();
    } else {
      throw new ValidationError(ErrorMessage.publicStatusIsInvalid);
    }

    this._createdAt = createdAt;
    this._updateAt = updateAt;
  }

  static createNewArticle(
    blogId: BlogId,
    title: string,
    content: string,
    tags: string[],
    isPublic: boolean
  ) {
    const currentDatetime = getCurrentDatetime();
    return new Article(
      ArticleId.createWithNewId(),
      blogId,
      title,
      content,
      tags,
      isPublic,
      currentDatetime,
      currentDatetime
    );
  }

  setTags(tags: string[]) {
    for (const tag of tags) {
      this.addTag(tag);
    }
  }

  changeTitle(title: string) {
    const validation = new Validator(
      { title },
      { title: 'required|string|max:64' }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first('title'));
    }

    this._title = title;
    this._updateAt = getCurrentDatetime();
  }

  get title() {
    return this._title;
  }

  changeContent(content: string) {
    const validation = new Validator(
      { content },
      { content: 'required|string|max:64' }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first('content'));
    }

    this._content = content;
    this._updateAt = getCurrentDatetime();
  }

  addTag(tag: string) {
    const validation = new Validator(
      { tag },
      { tag: 'required|string|max:15' }
    );

    if (validation.fails()) {
      throw new ValidationError(validation.errors.first('tag'));
    }

    if (this._tags.length > this.maxTagConut) {
      throw new OverflowError(ErrorMessage.tagCountIsOverflow);
    }

    if (this._tags.includes(tag)) {
      throw new DuplicationError(ErrorMessage.tagIsDuplicated);
    }

    this._tags.push(tag);
    this._updateAt = getCurrentDatetime();
  }

  publish() {
    this._isPublic = true;
  }

  hide() {
    this._isPublic = false;
    this._updateAt = getCurrentDatetime();
  }

  get isPublic() {
    return this._isPublic;
  }

  get tags() {
    return this._tags;
  }

  get id() {
    return this._id;
  }

  get blogId() {
    return this._blogId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updateAt() {
    return this._updateAt;
  }

  get content() {
    return this._content;
  }
}
