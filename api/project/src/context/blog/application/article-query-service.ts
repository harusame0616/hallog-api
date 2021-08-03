import { Pagination } from '../../../helper/pagination';
import { BlogId } from '../domain/blog/blog-id';

export interface ArticleForNewArticlesDTO {
  id: string;
  title: string;
  eyecatch: string;
  tags: string[];
  publishedAt: Date;
}
export interface ArticleQueryService {
  getNewArticles(
    blogId: BlogId,
    pagination: Pagination
  ): Promise<ArticleForNewArticlesDTO[]>;
}
