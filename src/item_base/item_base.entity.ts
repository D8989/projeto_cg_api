import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProdutoEntity } from 'src/produto/produto.entity';

@ObjectType()
@Entity('item_base', { schema: process.env.SCHEMA })
export class ItemBaseEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column()
  nome: string;

  @Column({ name: 'nome_unique' })
  nomeUnique: string;

  @Column({ name: 'tipo_item_base_id' })
  tipoItemBaseId: number;

  @Field(() => String, { nullable: true })
  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true })
  descricao?: string;

  @ApiProperty({ type: () => TipoItemBaseEntity })
  @ManyToOne(() => TipoItemBaseEntity)
  @JoinColumn({ name: 'tipo_item_base_id' })
  tipoItemBase: TipoItemBaseEntity;

  @OneToMany(() => ProdutoEntity, (p) => p.itemBase)
  produtos: ProdutoEntity[];

  constructor(partial: Partial<ItemBaseEntity>) {
    Object.assign(this, partial);
  }
}
