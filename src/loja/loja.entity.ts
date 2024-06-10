import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity('loja', { schema: process.env.SCHEMA })
export class LojaEntity {
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

  @Column('varchar', { length: 100 })
  @Field(() => String)
  @ApiProperty({ type: String })
  apelido: string;

  @Column('varchar', { length: 200 })
  @Field(() => String)
  @ApiProperty({ type: String })
  rua: string;

  @Column('varchar', { length: 10 })
  @Field(() => String)
  @ApiProperty({ type: String })
  numero: string;

  @Column('varchar', { length: 20 })
  @Field(() => String)
  @ApiProperty({ type: String })
  cep: string;

  @Column('varchar', { length: 50 })
  @Field(() => String)
  @ApiProperty({ type: String })
  bairro: string;

  @Column('varchar', { length: 50 })
  @Field(() => String)
  @ApiProperty({ type: String })
  cidade: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  @ApiProperty({ type: String })
  referencia: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;
}
