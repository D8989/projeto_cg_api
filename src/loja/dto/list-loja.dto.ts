import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LojaEntity } from '../loja.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ListLojaDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  @Field(() => [LojaEntity])
  @ApiProperty({ type: () => LojaEntity, isArray: true })
  dados: LojaEntity[];

  constructor(resp: [LojaEntity[], number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
