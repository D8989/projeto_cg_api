import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptItemCompra } from '../interfaces/opt-item-compra.interface';

class BaseListItemCompraOptionsDto extends ListOptionsDto {
  compraIds?: number[];
  produtoIds?: number[];

  constructor(partial: Partial<BaseListItemCompraOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class ListItemCompraOptionsDto extends BaseListItemCompraOptionsDto {
  constructor(listOpt: Partial<BaseListItemCompraOptionsDto>) {
    super(listOpt);
  }
  toIOptItemCompra(): IOptItemCompra {
    return {
      ...this,
    };
  }
}
