import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { NumberFunctions } from 'src/common/functions/number-functions.class';

@Entity('pagamento', { schema: process.env.SCHEMA })
@ObjectType()
export class PagamentoEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { name: 'ususario_id' })
  usuarioId: number;

  @Column('integer', { name: 'compra_id' })
  compraId: number;

  @Field(() => Number)
  @ApiProperty({ type: Number })
  @Column('numeric', {
    transformer: NumberFunctions.numericTransform(),
  })
  valor: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column('varchar', { length: 10, name: 'forma_pagamento' })
  formaPagamento: string;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'usuario_id' })
  usario: UsuarioEntity;

  // constructor() {}
  constructor(partial: Partial<PagamentoEntity>) {
    Object.assign(this, partial);
  }
}
