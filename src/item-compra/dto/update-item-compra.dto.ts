import { EGramatura } from 'src/common/enum/gramatura.enum';

export class UpdateItemCompraDto {
  produtoId?: number;
  compraId?: number;
  quantidade?: number;
  custo?: number;
  gramatura?: EGramatura;
}
