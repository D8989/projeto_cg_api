import { ApiProperty } from '@nestjs/swagger';
import { ViewLojaDto } from './view-loja.dto';

export class ListViewLojaDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: () => ViewLojaDto, isArray: true })
  dados: ViewLojaDto[];

  constructor(resp: [ViewLojaDto[], number]) {
    this.total = resp[1];
    this.dados = resp[0];
  }
}
