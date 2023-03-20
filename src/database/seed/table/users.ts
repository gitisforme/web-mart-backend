import { In, QueryRunner } from 'typeorm';
import { hash } from 'bcryptjs';

import { Users } from '../../../model/Users';
import { WebMartUserType } from '../../../constants';

const IDS = {
  ADMIN: '706dd907-3b96-4ad7-84a4-f5ac91ebd68c',
};

const up = async (queryRunner: QueryRunner): Promise<void> => {
  const userRepo = queryRunner.manager.getRepository(Users);
  const user = userRepo.create({
    id: IDS.ADMIN,
    firstName: 'Demo user',
    lastName:  'Demo user',
    email: 'admin@gmail.com',
    password: await hash('password', 8),
    userType: [WebMartUserType.ADMIN],
  });
  await user.save();
};

const down = async (queryRunner: QueryRunner): Promise<void> => {
  const userRepo = queryRunner.manager.getRepository(Users);
  await userRepo.delete({ id: In(Object.values(IDS)) });
};

export default { up, down };
