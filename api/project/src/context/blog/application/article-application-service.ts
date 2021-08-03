import { NotFoundError } from '../../../error/not-found-error';
import { Pagination } from '../../../helper/pagination';
import { Article } from '../domain/article/article';
import { ArticleId } from '../domain/article/article-id';
import { ArticleRepository } from '../domain/article/article-repository';
import { ArticleService } from '../domain/article/article-service';
import { BlogId } from '../domain/blog/blog-id';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BloggerId } from '../domain/blogger/blogger-id';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { ArticleQueryService } from './article-query-service';

const ErrorMessage = {
  articleIsNotFound: '記事が見つかりません',
};

export class ArticleApplicationService {
  private _articleService;
  private _blogRepository;
  private _bloggerRepository;
  private _articleRepository;
  private _articleQueryService;

  constructor(
    blogRepository: BlogRepository,
    bloggerRepository: BloggerRepository,
    articleRepository: ArticleRepository,
    articleQueryService: ArticleQueryService
  ) {
    this._blogRepository = blogRepository;
    this._bloggerRepository = bloggerRepository;
    this._articleRepository = articleRepository;
    this._articleService = new ArticleService(
      blogRepository,
      bloggerRepository,
      articleRepository
    );
    this._articleQueryService = articleQueryService;
  }

  async post(
    posterId: string,
    blogId: string,
    title: string,
    content: string,
    tags: string[],
    isPublic: boolean
  ) {
    const article = Article.createNewArticle(
      new BlogId(blogId),
      title,
      content,
      tags,
      isPublic
    );

    await this._articleService.canPost(new BloggerId(posterId), article);
    await this._articleRepository.insert(article);
  }

  async read(articleId: string) {
    const article = await this._articleRepository.findOneById(
      new ArticleId(articleId)
    );

    if (!article) {
      throw new NotFoundError(ErrorMessage.articleIsNotFound);
    }

    await this._articleService.canRead(article);
    return {
      title: article.title,
      content: article.content,
      tags: article.tags,
      createdAt: article.createdAt,
      updatedAt: article.updateAt,
    };
  }

  getNewArticles(blogId: string, size: number, index: number) {
    const pagination = new Pagination(size, index);
    const id = new BlogId(blogId);
    return this._articleQueryService.getNewArticles(id, pagination);
  }
}
