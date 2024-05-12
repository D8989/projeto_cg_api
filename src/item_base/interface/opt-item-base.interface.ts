import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptItemBase extends IFindOpt {
  tipoItemBaseIds?: number[];
  nome?: IColumnStrOpt;
  descricao?: IColumnStrOpt;
  nomeUnique?: string;
}
