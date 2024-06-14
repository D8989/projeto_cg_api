import { Injectable } from '@nestjs/common';
import { CompraRepo } from './compra.repo';

@Injectable()
export class CompraService {
  constructor(private compraRepo: CompraRepo) {}
}
