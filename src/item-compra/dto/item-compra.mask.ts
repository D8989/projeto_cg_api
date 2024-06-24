import { EGramatura } from 'src/common/enum/gramatura.enum';

export class ItemCompraMask {
  id?: number;
  produtoId?: number;
  compraId?: number;
  quantidade?: number;
  custo?: number;
  gramatura?: EGramatura;

  constructor(partial: Partial<ItemCompraMask>) {
    Object.assign(this, partial);
  }
}
