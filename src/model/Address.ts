import {
  Column,
  Entity,
  Index,
  ManyToOne,
  RelationId,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Users } from "./Users";

@Entity("address", { schema: "public" })
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 255, nullable: true })
  full_name!: string;

  @Column("varchar", { length: 255, nullable: true })
  phone_number!: string;

  @Column("varchar", { length: 255, nullable: true })
  address1!: string;

  @Column("varchar", { length: 255, nullable: true })
  address2!: string;
  
  @Column("varchar", { length: 255, nullable: true })
  city!: string;

  @Column("varchar", { length: 255, nullable: true })
  county!: string;

  @Column("varchar", { length: 255, nullable: true })
  country!: string;

  @Column("varchar")
  pincode!: string;

  @Column("integer", { nullable: true })
  houseNumber!: number | null;

  @Column("boolean", { default: () => "true" })
  isDefault!: boolean;

  @Index()
  @ManyToOne(() => Users, (users) => users.address)
  user!: Users | null;

  @RelationId((address: Address) => address.user)
  userId!: string | null;
}
