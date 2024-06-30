import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptPagamento extends IFindOpt {
  compraIds?: number[];
  nomeUsuario?: IColumnStrOpt;
  nomeUsuarioUnique?: string;
}
