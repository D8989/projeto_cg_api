import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity('marca', { schema: process.env.SCHEMA })
@ObjectType()
export class MarcaEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('varchar')
  @Field(() => String)
  nome: string;

  @Column('varchar', { name: 'nome_unique' })
  nomeUnique: string;

  @Column('varchar', { nullable: true })
  @Field(() => String, { nullable: true })
  descricao?: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  constructor(partial: Partial<MarcaEntity>) {
    Object.assign(this, partial);
  }
}
