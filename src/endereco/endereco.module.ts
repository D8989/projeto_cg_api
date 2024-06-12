import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';

@Module({
  providers: [EnderecoService],
  exports: [EnderecoService],
})
export class enderecoModule {}
