import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { LojaEntity } from 'src/loja/loja.entity';
import { ItemCompraEntity } from 'src/item-compra/item-compra.entity';

@Entity('compra', { schema: process.env.SCHEMA })
@ObjectType()
export class CompraEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @Column('integer')
  codigo: number;

  @Field(() => Date)
  @ApiProperty({ type: String, format: 'ISO-STRING' })
  @Column('timestamptz', { name: 'data_compra' })
  dataCompra: Date;

  @Column({ name: 'loja_id' })
  lojaId: number;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  @ManyToOne(() => LojaEntity)
  @JoinColumn({ name: 'loja_id' })
  loja: LojaEntity;

  @OneToMany(() => ItemCompraEntity, (item) => item.produto)
  itens: ItemCompraEntity[];

  constructor(partial: Partial<CompraEntity>) {
    Object.assign(this, partial);
  }
}
