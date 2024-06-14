import { Resolver } from '@nestjs/graphql';
import { PagamentoEntity } from './pagamento.entity';
import { PagamentoService } from './pagamento.service';

@Resolver(() => PagamentoEntity)
export class PagamentoResolver {
  constructor(private pagamentoService: PagamentoService) {}
}
