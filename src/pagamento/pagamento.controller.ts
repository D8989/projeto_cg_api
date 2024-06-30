import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PagamentoService } from './pagamento.service';

@Controller('pagamento')
@ApiTags('Pagamento')
export class PagamentoController {
  constructor(private pagamentoService: PagamentoService) {}
}
