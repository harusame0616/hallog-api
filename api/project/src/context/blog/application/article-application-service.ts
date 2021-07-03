import { NotFoundError } from '../../../error/not-found-error';
import { Article } from '../domain/article/article';
import { ArticleId } from '../domain/article/article-id';
import { ArticleRepository } from '../domain/article/article-repository';
import { ArticleService } from '../domain/article/article-service';
import { BlogId } from '../domain/blog/blog-id';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BloggerId } from '../domain/blogger/blogger-id';
import { BloggerRepository } from '../domain/blogger/blogger-repository';

const ErrorMessage = {
  articleIsNotFound : '記事が見つかりません'
}

export class ArticleApplicationService {
  private _articleService;
  private _blogRepository;
  private _bloggerRepository;
  private _articleRepository;

  constructor(
    blogRepository: BlogRepository,
    bloggerRepository: BloggerRepository,
    articleRepository: ArticleRepository
  ) {
    this._blogRepository = blogRepository;
    this._bloggerRepository = bloggerRepository;
    this._articleRepository = articleRepository;
    this._articleService = new ArticleService(
      blogRepository,
      bloggerRepository,
      articleRepository
    );
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
    }
  }
}
