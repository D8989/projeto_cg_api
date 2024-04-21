import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';

@ObjectType()
@Entity('item_base', { schema: process.env.SCHEMA })
export class ItemBaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  nome: string;

  @Column({ name: 'nome_unique' })
  nomeUnique: string;

  @Column({ name: 'tipo_item_base_id' })
  tipoItemBaseId: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  descricao?: string;

  @ManyToOne(() => TipoItemBaseEntity)
  @JoinColumn({ name: 'tipo_item_base_id' })
  tipoItemBase: TipoItemBaseEntity;

  constructor(partial: Partial<ItemBaseEntity>) {
    Object.assign(this, partial);
  }
}
