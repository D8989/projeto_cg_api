import { EGramatura } from 'src/common/enum/gramatura.enum';

export class CreateItemCompraDto {
  produtoId: number;
  compraId: number;
  quantidade: number;
  custo: number;
  gramatura: EGramatura;
}
