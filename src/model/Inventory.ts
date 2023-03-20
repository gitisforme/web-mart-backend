import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('inventory', { schema: 'public' })
  export class Inventory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;
  
    @Column('integer', { nullable: true })
    quantity!: number | null;
  
    @Column('integer', { nullable: true })
    price!: number | null;
  
    @Column('integer', { nullable: true })
    discount!: number | null;
  }
  