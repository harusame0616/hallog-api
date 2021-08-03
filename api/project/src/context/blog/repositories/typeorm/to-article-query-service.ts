import { getRepository, In } from 'typeorm';
import { ArticleEntity } from '../../../../db/entities/article-entity';
import { TagEntity } from '../../../../db/entities/tag-entity';
import { Pagination } from '../../../../helper/pagination';
import { ArticleForNewArticlesDTO } from '../../application/article-query-service';
import { BlogId } from '../../domain/blog/blog-id';

interface TagsEachArticle {
  [KEY: string]: [string];
}

export class TOArticleQueryService {
  async getNewArticles(
    blogId: BlogId,
    pagination: Pagination
  ): Promise<ArticleForNewArticlesDTO[]> {
    const articleRepo = getRepository(ArticleEntity);

    const articles = await articleRepo.find({
      where: {
        blogId: blogId.value,
        isPublic: true,
      },
      order: {
        publishedAt: 'DESC',
      },
      skip: pagination.skip,
      take: pagination.size,
    });

    const tagRepo = getRepository(TagEntity);
    const tags = await tagRepo.find({
      where: {
        articleId: In(articles.map(({ id }) => id)),
      },
    });

    const tagsEachArticle = tags.reduce((prev, { name, articleId }) => {
      if (!prev[articleId]) {
        prev[articleId] = [name];
      } else {
        prev[articleId].push(name);
      }

      return prev;
    }, {} as TagsEachArticle);

    return articles.map(
      ({ id, title, publishedAt }): ArticleForNewArticlesDTO => ({
        id,
        title,
        eyecatch: '',
        tags: tagsEachArticle[id],
        publishedAt: publishedAt!,
      })
    );
  }
}
