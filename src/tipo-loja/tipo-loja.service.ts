import { Injectable } from '@nestjs/common';
import { TipoLojaRepo } from './tipo-loja.repo';

@Injectable()
export class TipoLojaService {
  constructor(private tipoLojaRepo: TipoLojaRepo) {}
}
