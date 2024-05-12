import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MarcaEntity } from '../marca.entity';

@ObjectType()
export class ListMarcaDto {
  @Field(() => Int)
  total: number;

  @Field(() => [MarcaEntity])
  dados: MarcaEntity[];

  constructor(resp: [rows: MarcaEntity[], count: number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
