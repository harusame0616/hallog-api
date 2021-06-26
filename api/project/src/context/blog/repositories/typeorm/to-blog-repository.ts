import { EntityTarget } from 'typeorm';
import { BlogEntity } from '../../../../db/entities/blog-entity';
import { TORepository } from '../../../share/repository/typeorm/to-repository';
import { Blog } from '../../domain/blog/blog';
import { BlogId } from '../../domain/blog/blog-id';
import { BlogRepository } from '../../domain/blog/blog-repository';
import { Blogger } from '../../domain/blogger/blogger';
import { BloggerId } from '../../domain/blogger/blogger-id';

export class TOBlogRepository
  extends TORepository<BlogEntity, Blog>
  implements BlogRepository
{
  findByOwner(blogger: Blogger): Promise<Blog[]> {
    return this.find({ ownerId: blogger.bloggerId.value });
  }

  findOneById(id: BlogId): Promise<Blog | undefined> {
    return this.findOne({ id: id.value });
  }

  entityTarget(): EntityTarget<BlogEntity> {
    return BlogEntity;
  }

  toDomainEntity(entity?: BlogEntity) {
    if (!entity) {
      return undefined;
    }

    return new Blog(
      new BlogId(entity.id),
      entity.title,
      entity.description,
      new BloggerId(entity.ownerId)
    );
  }

  toDBEntity(entity?: Blog) {
    if (!entity) {
      return undefined;
    }

    return new BlogEntity(
      entity.id.value,
      entity.title,
      entity.description,
      entity.ownerId.value
    );
  }
}
