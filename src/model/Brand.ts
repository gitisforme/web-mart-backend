import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  
  @Entity('brand', { schema: 'public' })
  export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;
  
    @Column('varchar', { length: 255 })
    name!: string;
  
    @Column('integer', { nullable: true })
    threshold!: number | null;
  }
  