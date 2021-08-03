import { EntityTarget, getRepository } from 'typeorm';
import { ArticleEntity } from '../../../../db/entities/article-entity';
import { TagEntity } from '../../../../db/entities/tag-entity';
import { TORepository } from '../../../share/repository/typeorm/to-repository';
import { Article } from '../../domain/article/article';
import { ArticleId } from '../../domain/article/article-id';
import { ArticleRepository } from '../../domain/article/article-repository';
import { BlogId } from '../../domain/blog/blog-id';

export class TOArticleRepository
  extends TORepository<ArticleEntity, Article>
  implements ArticleRepository
{
  defaultFindOption = { relations: ['tags'] };

  entityTarget(): EntityTarget<ArticleEntity> {
    return ArticleEntity;
  }

  async findOneById(articleId: ArticleId) {
    return this.findOne({ id: articleId.value });
  }

  async toDomainEntity(entity: ArticleEntity) {
    return new Article(
      new ArticleId(entity.id),
      new BlogId(entity.blogId),
      entity.title,
      entity.content,
      entity.tags?.map((tag) => tag.name) || [],
      entity.isPublic,
      entity.createdAt,
      entity.updateAt
    );
  }
  async toDBEntity(entity: Article) {
    return new ArticleEntity(
      entity.id.value,
      entity.blogId.value,
      entity.title,
      entity.content,
      entity.isPublic,
      entity.createdAt,
      entity.updateAt
    );
  }

  async afterSave(entity: Article) {
    const tagRepository = getRepository(TagEntity);
    const articleEntity = await this.toDBEntity(entity);

    await tagRepository.save(
      entity.tags.map((tag) => new TagEntity(tag, articleEntity.id))
    );
  }
}
