import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ItemBaseEntity } from 'src/item_base/item_base.entity';
import { MarcaEntity } from 'src/marca/marca.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';

@Entity('produto', { schema: process.env.SCHEMA })
@ObjectType()
export class ProdutoEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @Column({ name: 'marca_id' })
  marcaId: number;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @Column({ name: 'item_base_id' })
  itemBaseId: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column()
  nome: string;

  @Column({ name: 'nome_unique' })
  nomeUnique: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column()
  descricao: string;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @Column()
  quantidade: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column()
  gramatura: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  @ApiProperty({ type: () => MarcaEntity })
  @ManyToOne(() => MarcaEntity)
  @JoinColumn({ name: 'marca_id' })
  marca: MarcaEntity;

  @ApiProperty({ type: () => ItemBaseEntity })
  @ManyToOne(() => ItemBaseEntity)
  @JoinColumn({ name: 'item_base_id' })
  itemBase: ItemBaseEntity;

  constructor(partial: Partial<ProdutoEntity>) {
    Object.assign(this, partial);
  }
}
