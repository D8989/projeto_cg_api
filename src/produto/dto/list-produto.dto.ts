import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProdutoEntity } from '../produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ListProdutoDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  @Field(() => [ProdutoEntity])
  @ApiProperty({ type: () => ProdutoEntity, isArray: true })
  dados: ProdutoEntity[];

  constructor(resp: [ProdutoEntity[], number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
