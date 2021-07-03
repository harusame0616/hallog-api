import { Article } from './article';
import { ArticleId } from './article-id';

export interface ArticleRepository {
  insert(article: Article): Promise<void>;
  findOneById(articleId: ArticleId): Promise<Article | undefined>;
}
