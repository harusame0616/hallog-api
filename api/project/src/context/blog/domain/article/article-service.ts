import { DuplicationError } from '../../../../error/duplication-error';
import { NotFoundError } from '../../../../error/not-found-error';
import { PermissionError } from '../../../../error/permission-error';
import { BlogRepository } from '../blog/blog-repository';
import { BloggerId } from '../blogger/blogger-id';
import { BloggerRepository } from '../blogger/blogger-repository';
import { Article } from './article';
import { ArticleRepository } from './article-repository';

const ErrorMessage = {
  articleExists: '作成済みの記事です',
  bloggerDoesntExist: 'ブロガーが存在しません',
  blogDoesntExist: 'ブログが存在しません',
};

export class ArticleService {
  private readonly _articleRepository: ArticleRepository;
  private readonly _blogRepository: BlogRepository;
  private readonly _bloggerRepository: BloggerRepository;

  constructor(
    blogRepository: BlogRepository,
    bloggerRepository: BloggerRepository,
    articleRepository: ArticleRepository
  ) {
    this._articleRepository = articleRepository;
    this._blogRepository = blogRepository;
    this._bloggerRepository = bloggerRepository;
  }

  async canPost(posterId: BloggerId, postArticle: Article) {
    const [article, blog, blogger] = await Promise.all([
      this._articleRepository.findOneById(postArticle.id),
      this._blogRepository.findOneById(postArticle.blogId),
      this._bloggerRepository.findOneByBloggerId(posterId),
    ]);

    if (article) {
      throw new DuplicationError(ErrorMessage.articleExists);
    }

    if (!blogger) {
      throw new NotFoundError(ErrorMessage.bloggerDoesntExist);
    }

    if (!blog) {
      throw new NotFoundError(ErrorMessage.blogDoesntExist);
    }

    if (!blog.ownerOf(posterId)) {
      throw new PermissionError(posterId);
    }
  }
}
