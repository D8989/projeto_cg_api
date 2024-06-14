import { Injectable } from '@nestjs/common';
import { PagamentoRepo } from './pagamento.repo';

@Injectable()
export class PagamentoService {
  constructor(private pagamentoRepo: PagamentoRepo) {}
}
