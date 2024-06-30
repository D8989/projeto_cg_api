import { ApiProperty } from '@nestjs/swagger';

export class ViewListCompraDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  codigo: number;

  @ApiProperty({ type: Date })
  dataCompra: Date;

  @ApiProperty({ type: String })
  lojaNome: string;

  @ApiProperty({ type: Number, format: 'Currency' })
  valorTotal: number;

  constructor(obj: ViewListCompraDto) {
    Object.assign(this, obj);
  }
}
