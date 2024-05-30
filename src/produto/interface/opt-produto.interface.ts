import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';

export interface IOptProduto extends IFindOpt {
  nome?: IColumnStrOpt;
  descricao?: IColumnStrOpt;
  marcaNome?: IColumnStrOpt;
  itemBaseNome?: IColumnStrOpt;
  bringMarca?: boolean;
  bringItemBase?: boolean;
  nomeUnique?: string;
  marcaIds?: number[];
  itemBaseIds?: number[];
  quantidades?: number[];
}
