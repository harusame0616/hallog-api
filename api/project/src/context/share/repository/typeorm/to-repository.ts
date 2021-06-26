import {
  createConnection,
  EntityTarget,
  getRepository,
  Repository,
} from 'typeorm';
import { CustomError } from '../../../../error/custom-error';

class DomainModelConversionError extends CustomError {}
const ErrorMessage = { modelConversion: 'モデルの変換に失敗しました' };

export abstract class TORepository<DB_ENTITY, DOMAIN_ENTITY> {
  private readonly repository: Repository<DB_ENTITY>;

  static connect() {
    return createConnection();
  }

  constructor() {
    this.repository = getRepository(this.entityTarget());
  }

  async findOne(object: object) {
    return this.toDomainEntity(await this.repository.findOne(object));
  }

  async find(object: object): Promise<DOMAIN_ENTITY[]> {
    const entities = await this.repository.find(object);
    return entities
      .map((entity) => this.toDomainEntity(entity))
      .filter((entity) => entity) as DOMAIN_ENTITY[];
  }

  async delete(object: object) {
    this.repository.delete(object);
  }

  async save(domainEntity: DOMAIN_ENTITY) {
    const dbEntity = this.toDBEntity(domainEntity);
    if (!dbEntity) {
      throw new DomainModelConversionError(ErrorMessage.modelConversion);
    }

    this.repository.save(dbEntity);
  }

  async insert(domainEntity: DOMAIN_ENTITY) {
    const dbEntity = this.toDBEntity(domainEntity);

    if (!dbEntity) {
      throw new DomainModelConversionError(ErrorMessage.modelConversion);
    }

    this.repository.insert(dbEntity);
  }

  abstract entityTarget(): EntityTarget<DB_ENTITY>;
  abstract toDomainEntity(entity?: DB_ENTITY): DOMAIN_ENTITY | undefined;
  abstract toDBEntity(entity?: DOMAIN_ENTITY): DB_ENTITY | undefined;
}
