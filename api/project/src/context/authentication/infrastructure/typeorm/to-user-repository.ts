import { EntityTarget } from 'typeorm';
import { UserEntity } from '../../../../db/entities/user-entity';
import { TORepository } from '../../../share/repository/typeorm/to-repository';
import { UserRepository } from '../../domain/user-repository';
import { Email } from '../../domain/user/email';
import { HashPassword } from '../../domain/user/hash-password';
import { User } from '../../domain/user/user';
import { UserId } from '../../domain/user/user-id';

export class TOUserRepository
  extends TORepository<UserEntity, User>
  implements UserRepository
{
  entityTarget(): EntityTarget<UserEntity> {
    return UserEntity;
  }

  async toDomainEntity(entity: UserEntity) {
    return new User(
      new UserId(entity.userId),
      new Email(entity.email),
      new HashPassword(entity.hashPassword)
    );
  }

  async toDBEntity(entity: User) {
    return new UserEntity(
      entity.id.value,
      entity.email.value,
      entity.hashPassword.value
    );
  }

  findOneByUserId(userId: UserId, opt: object = {}) {
    return this.findOne({
      where: { bloggerId: userId.value },
      ...opt,
    });
  }

  findOneByEmail(email: Email) {
    return this.findOne({ where: { email: email.value } });
  }
}
