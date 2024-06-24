import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptItemCompra extends IFindOpt {
  compraIds?: number[];
  produtoIds?: number[];
}
