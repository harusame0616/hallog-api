import { EntityTarget } from 'typeorm';
import { BloggerEntity } from '../../../../db/entities/blogger-entity';
import { TORepository } from '../../../share/repository/typeorm/to-repository';
import { Blogger } from '../../domain/blogger/blogger';
import { BloggerId } from '../../domain/blogger/blogger-id';
import { BloggerRepository } from '../../domain/blogger/blogger-repository';
import { Nickname } from '../../domain/blogger/nickname';
import { PrComment } from '../../domain/blogger/pr-comment';

export class TOBloggerRepository
   extends TORepository<BloggerEntity, Blogger>
  implements BloggerRepository
{
  entityTarget(): EntityTarget<BloggerEntity> {
    return BloggerEntity;
  }

  toDomainEntity(entity?: BloggerEntity) {
    if (!entity) {
      return undefined;
    }

    return new Blogger(
      new BloggerId(entity.bloggerId),
      new Nickname(entity.nickname),
      new PrComment(entity.prComment)
    );
  }

  toDBEntity(entity?: Blogger) {
    if (!entity) {
      return undefined;
    }

    return new BloggerEntity(
      entity.bloggerId.value,
      entity.nickname.value,
      entity.prComment.value
    );
  }

  findOneByBloggerId(bloggerId: BloggerId) {
    return this.findOne({
      where: { bloggerId: bloggerId.value },
    });
  }
}
