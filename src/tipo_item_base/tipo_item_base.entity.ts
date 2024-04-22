import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';

@ObjectType()
@Entity('tipo_item_base', { schema: process.env.SCHEMA })
export class TipoItemBaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  nome: string;

  @Column({ name: 'nome_unique' })
  nomeUnique: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  descricao?: string;

  constructor(partial: Partial<TipoItemBaseEntity>) {
    Object.assign(this, partial);
  }
}
