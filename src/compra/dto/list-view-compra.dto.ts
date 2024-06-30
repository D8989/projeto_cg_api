import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AListEntity } from 'src/common/classes/list-entity.abstract';
import { ViewListCompraDto } from './view-list-compra.dto';

@ObjectType()
export class ListViewCompraDto extends AListEntity {
  @Field(() => [ViewListCompraDto])
  @ApiProperty({ type: () => ViewListCompraDto, isArray: true })
  dados: ViewListCompraDto[];

  constructor(resp: [ViewListCompraDto[], number]) {
    super(resp[1]);
    this.dados = resp[0];
  }
}
