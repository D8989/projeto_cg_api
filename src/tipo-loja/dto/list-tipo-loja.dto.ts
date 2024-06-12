import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TipoLojaEntity } from '../tipo-loja.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ListTipoLojaDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  @Field(() => [TipoLojaEntity])
  @ApiProperty({ type: () => TipoLojaEntity, isArray: true })
  dados: TipoLojaEntity[];

  constructor(resp: [TipoLojaEntity[], number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
