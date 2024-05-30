import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MarcaEntity } from '../marca.entity';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ListMarcaDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  @Field(() => [MarcaEntity])
  @ApiProperty({ type: () => MarcaEntity, isArray: true })
  dados: MarcaEntity[];

  constructor(resp: [MarcaEntity[], number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
