import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptTipoLoja extends IFindOpt {
  nome?: IColumnStrOpt;
  nomeUnique?: string;
  descricao?: string;
}
