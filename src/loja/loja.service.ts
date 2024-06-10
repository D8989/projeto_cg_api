import { Injectable } from '@nestjs/common';
import { LojaRepo } from './loja.repo';

@Injectable()
export class LojaService {
  constructor(private lojaRepo: LojaRepo) {}
}
