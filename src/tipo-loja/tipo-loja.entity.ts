import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tipo_loja', { schema: process.env.SCHEMA })
@ObjectType()
export class TipoLojaEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  @ApiProperty({ type: Number })
  id: number;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  @ApiProperty({ type: String })
  nome: string;

  @Column('varchar', { name: 'nome_unique', length: 100 })
  nomeUnique: string;

  @Column('varchar', { length: 200 })
  @Field(() => String)
  @ApiProperty({ type: String })
  descricao: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  constructor(partial: Partial<TipoLojaEntity>) {
    Object.assign(this, partial);
  }
}
