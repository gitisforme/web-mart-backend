import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';

import { EntityNotFoundError } from '../error';

interface WithId {
  id: string | number;
}

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  async findByIdOrFail(
    id: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.findOne(id).then((value) => {
      if (value === undefined) {
        return Promise.reject(new EntityNotFoundError(id, this.metadata.name));
      }
      return Promise.resolve(value);
    });
  }

  /**
   * Reload an entity from the database
   * @param entity
   *
   * @ref https://github.com/typeorm/typeorm/issues/2069#issuecomment-386348206
   */
  public reload(entity: FindOneOptions<Entity>): Promise<Entity> {
    return this.findOneOrFail(entity);
  }
}
