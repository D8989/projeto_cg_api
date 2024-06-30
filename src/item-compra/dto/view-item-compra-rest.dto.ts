import { ApiProperty } from '@nestjs/swagger';

export class ViewItemCompraRest {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  produtoNome: string;

  @ApiProperty({ type: Number })
  quantidade: number;

  @ApiProperty({ type: Number })
  custo: number;

  @ApiProperty({ type: String })
  gramatura: string;
}
