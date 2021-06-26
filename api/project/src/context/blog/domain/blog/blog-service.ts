import { DuplicationError } from '../../../../error/duplication-error';
import { NotFoundError } from '../../../../error/not-found-error';
import { OverflowError } from '../../../../error/overflow-error';
import { BloggerRepository } from '../blogger/blogger-repository';
import { Blog } from './blog';
import { BlogRepository } from './blog-repository';

class ErrorMessage {
  static bloggerIsNotFound = 'ブロガーが見つかりません';
  static blogIsCreatedAlready = '作成済みのブログです';
  static overflowMaxBlogCount = '１ユーザーの最大ブログ数を超えています';
}

export class BlogService {
  private static readonly blogMaxNum = 10;
  constructor(
    private bloggerRepository: BloggerRepository,
    private blogRepository: BlogRepository
  ) {}

  async canCreate(blog: Blog) {
    const ownerId = blog.ownerId;
    const owner = await this.bloggerRepository.findOneByBloggerId(ownerId);

    if (!owner) {
      throw new NotFoundError(ErrorMessage.bloggerIsNotFound);
    }

    const createdBlog = await this.blogRepository.findOneById(blog.id);
    if (createdBlog) {
      throw new DuplicationError(ErrorMessage.blogIsCreatedAlready);
    }

    const blogs = await this.blogRepository.findByOwner(owner);
    if (blogs.length > BlogService.blogMaxNum) {
      throw new OverflowError(ErrorMessage.overflowMaxBlogCount);
    }
  }
}
