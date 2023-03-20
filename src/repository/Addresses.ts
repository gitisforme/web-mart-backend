import { EntityRepository } from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Users } from '../model/Users';
import { Address } from '../model/Address';

// @EntityRepository(Address)
// export class UsersRepository extends BaseRepository<Address> {
//   async getByRelatioins(user: Users, relations: Array<string>): Promise<Address | undefined> {
//     return this.findOne({ where: { id: user?.id }, relations });
//   }
// }
