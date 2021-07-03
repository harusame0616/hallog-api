import { Article } from '../../domain/article/article';
import { ArticleId } from '../../domain/article/article-id';
import { ArticleRepository } from '../../domain/article/article-repository';

export class OMArticleRepository implements ArticleRepository {
  articles: Article[] = [];

  async insert(article: Article): Promise<void> {
    this.articles.push(article);
  }

  async findOneById(articleId: ArticleId): Promise<Article | undefined> {
    return this.articles.find((article) => article.id.equals(articleId));
  }
}
