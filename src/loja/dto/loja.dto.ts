import { EnderecoDto } from 'src/endereco/dto/endereco.dto';
import { LojaEntity } from '../loja.entity';

export class LojaDto {
  nome?: string;
  nomeUnique?: string;
  apelido?: string;
  tipoLojaId?: number;
  enderecoDto?: EnderecoDto;
}
