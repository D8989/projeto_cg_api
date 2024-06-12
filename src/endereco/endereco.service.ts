import { Injectable } from '@nestjs/common';
import { EnderecoDto } from './dto/endereco.dto';
import { CreateEnderecoInput } from './dto/create-endereco.input';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Injectable()
export class EnderecoService {
  constructor() {}

  getEnderecoDto(end: CreateEnderecoInput): EnderecoDto {
    return {
      bairro: end.bairro || '-',
      cep: end.cep || '00000000',
      numero: end.numero || 'n/a',
      referencia: end.referencia || '-',
      rua: end.rua,
      cidade: end.cidade,
    };
  }

  hasChange(end: EnderecoDto, emdDto: EnderecoDto) {
    return !ObjectFunctions.deepEqual(end, emdDto);
  }
}
