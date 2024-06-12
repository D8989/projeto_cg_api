import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptLoja extends IFindOpt {
  nome?: IColumnStrOpt;
  nomeUnique?: string;
  withTipoLoja?: boolean;
}
