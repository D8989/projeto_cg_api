import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TipoLojaEntity } from 'src/tipo-loja/tipo-loja.entity';

@Entity('loja', { schema: process.env.SCHEMA })
@ObjectType()
export class LojaEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  nome: string;

  @Column('varchar', { name: 'nome_unique', length: 100 })
  nomeUnique: string;

  @Column('varchar', { length: 100 })
  @Field(() => String)
  apelido: string;

  @Column('integer', { name: 'tipo_loja_id' })
  tipoLojaId: number;

  @Column('varchar', { length: 200 })
  rua: string;

  @Column('varchar', { length: 10 })
  numero: string;

  @Column('varchar', { length: 20 })
  cep: string;

  @Column('varchar', { length: 50 })
  bairro: string;

  @Column('varchar', { length: 50 })
  cidade: string;

  @Column('varchar', { length: 100 })
  referencia: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  @ManyToOne(() => TipoLojaEntity)
  @JoinColumn({ name: 'tipo_loja_id' })
  tipoLoja: TipoLojaEntity;

  constructor(partial: Partial<LojaEntity>) {
    Object.assign(this, partial);
  }
}
