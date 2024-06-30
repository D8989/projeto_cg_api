import { FormaPagamentoEnum } from 'src/common/enum/forma-pagamento.enum';

export class CreatePagamentoDto {
  compraId: number;
  valor: number;
  formaPagamento: string;
  usuarioId: number;
}
