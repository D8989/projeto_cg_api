import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptCompra extends IFindOpt {
  codigo?: string;
  lojaNome?: IColumnStrOpt;
  data?: Date;
  withLoja?: boolean;
}
