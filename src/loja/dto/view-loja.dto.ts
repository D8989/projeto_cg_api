import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from 'src/endereco/dto/endereco.dto';
import { TipoLojaEntity } from 'src/tipo-loja/tipo-loja.entity';

export class ViewLojaDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  nome: string;

  @ApiProperty({ type: String })
  apelido: string;

  @ApiProperty({ type: () => TipoLojaEntity, isArray: false })
  tipoLoja: TipoLojaEntity;

  @ApiProperty({ type: () => EnderecoDto, isArray: false })
  enderecoDto: EnderecoDto;

  constructor(obj: ViewLojaDto) {
    Object.assign(this, obj);
  }
}
