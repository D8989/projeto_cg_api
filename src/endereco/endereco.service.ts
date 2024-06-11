import { Injectable } from '@nestjs/common';
import { EnderecoDto } from './dto/endereco.dto';
import { CreateEnderecoInput } from './dto/create-endereco.input';

@Injectable()
export class EnderecoService {
  constructor() {}

  getEnderecoDto(end: CreateEnderecoInput): EnderecoDto {
    return {
      ...end,
      bairro: end.bairro || '-',
      cep: end.cep || '00000000',
      numero: end.numero || 'n/a',
      referencia: end.referencia || '-',
    };
  }
}
