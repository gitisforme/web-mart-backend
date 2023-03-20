import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Address } from './Address';
import { WebMartUserType } from '../constants';

@Entity('users', { schema: 'public' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255, nullable: true })
  firstName!: string;

  @Column('varchar', { length: 255, nullable: true })
  lastName!: string;

  @Column('varchar', { length: 255, nullable: true })
  email!: string;

  @Column('varchar', { nullable: true })
  password!: string;

  @Column('varchar', { nullable: true })
  countryCode!: string | null;

  @Column('varchar', { nullable: true })
  profileImage!: string | null;

  @Column('varchar', { nullable: true })
  mobileNumber!: string | null;

  @Column('varchar', { length: 255, nullable: true })
  token!: string | null;

  @Column('boolean', { default: () => 'false' })
  isEmailVerify!: boolean;

  @Column("text", { array: true, nullable: true })
  userType: string[];

  @Column('boolean', { default: () => 'true' })
  isActive!: boolean;

  @OneToMany(() => Address, (address) => address.user)
  address!: Address[];
}
