import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Users } from '../model/Users';

@EntityRepository(Users)
export class UsersRepository extends BaseRepository<Users> {
  async getByRelatioins(user: Users, relations: Array<string>): Promise<Users | undefined> {
    return this.findOne({ where: { id: user?.id }, relations });
  }
}
