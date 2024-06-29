import { ApiProperty } from '@nestjs/swagger';

export class ViewPagamentoRestDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  valor: number;

  @ApiProperty({ type: String })
  formaPagamento: string;

  @ApiProperty({ type: String })
  usuarioNome: string;
}
