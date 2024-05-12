import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptTipoItemBase extends IFindOpt {
  nome?: IColumnStrOpt;
  descricao?: IColumnStrOpt;
  nomeUnique?: string;
}
