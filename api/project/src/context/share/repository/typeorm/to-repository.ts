import {
  createConnection,
  EntityTarget,
  getRepository,
  Repository
} from 'typeorm';
import { CustomError } from '../../../../error/custom-error';

class DomainModelConversionError extends CustomError {}
const ErrorMessage = { modelConversion: 'モデルの変換に失敗しました' };

export abstract class TORepository<DB_ENTITY, DOMAIN_ENTITY> {
  private readonly repository: Repository<DB_ENTITY>;
  protected defaultFindOption = {};

  static connect() {
    return createConnection();
  }

  constructor() {
    this.repository = getRepository(this.entityTarget());
  }

  async findOne(object: object) {
    const entity = await this.repository.findOne(object, this.defaultFindOption);;
    if (!entity) {
      return undefined;;
    }

    return this.toDomainEntity(entity);
  }

  async find(object: object): Promise<DOMAIN_ENTITY[]> {
    const entities = await this.repository.find({ ...this.defaultFindOption, ...object });
    return Promise.all(entities.map((entity) => this.toDomainEntity(entity)));
  }

  async delete(object: object) {
    this.repository.delete(object);
  }

  async save(domainEntity: DOMAIN_ENTITY) {
    const dbEntity = await this.toDBEntity(domainEntity);
    if (!dbEntity) {
      throw new DomainModelConversionError(ErrorMessage.modelConversion);
    }

    await this.repository.save(dbEntity);
    await this.afterSave(domainEntity);
  }

  async insert(domainEntity: DOMAIN_ENTITY) {
    const dbEntity = await this.toDBEntity(domainEntity);

    if (!dbEntity) {
      throw new DomainModelConversionError(ErrorMessage.modelConversion);
    }

    await this.repository.insert(dbEntity);
    await this.afterSave(domainEntity);
  }
  async afterSave(entity: DOMAIN_ENTITY) { }

  abstract entityTarget(): EntityTarget<DB_ENTITY>;
  abstract toDomainEntity(entity: DB_ENTITY): Promise<DOMAIN_ENTITY>;
  abstract toDBEntity(entity: DOMAIN_ENTITY): Promise<DB_ENTITY>;
}
