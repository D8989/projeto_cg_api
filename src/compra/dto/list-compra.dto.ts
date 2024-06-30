import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CompraEntity } from '../compra.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ListCompraDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  @Field(() => [CompraEntity])
  @ApiProperty({ type: () => CompraEntity, isArray: true })
  dados: CompraEntity[];

  constructor(resp: [CompraEntity[], number]) {
    this.dados = resp[0];
    this.total = resp[1];
  }
}
