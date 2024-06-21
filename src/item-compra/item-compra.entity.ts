import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import 'dotenv/config';
import { Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ProdutoEntity } from 'src/produto/produto.entity';
import { CompraEntity } from 'src/compra/compra.entity';

@Entity('item_compra', { schema: process.env.SCHEMA })
export class ItemCompraEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'produto_id' })
  produtoId: number;

  @Column({ name: 'compra_id' })
  compraId: number;

  @Field(() => Number)
  @ApiProperty({ type: Number })
  @Column('numeric', {
    transformer: {
      from(value: string) {
        return parseFloat(value);
      },
      to(value: number) {
        return value.toString();
      },
    },
  })
  quantidade: number;

  @Field(() => Number)
  @ApiProperty({ type: Number })
  @Column('numeric', {
    transformer: {
      from(value: string) {
        return parseFloat(value);
      },
      to(value: number) {
        return value.toString();
      },
    },
  })
  custo: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column('varchar', { length: 10 })
  gramatura: string;

  @ManyToOne(() => ProdutoEntity)
  @JoinColumn({ name: 'produto_id' })
  produto: ProdutoEntity;

  @ManyToOne(() => CompraEntity)
  @JoinColumn({ name: 'compra_id' })
  compra: CompraEntity;

  constructor(partial: Partial<ItemCompraEntity>) {
    Object.assign(this, partial);
  }
}
