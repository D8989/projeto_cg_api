import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';
import { IFindOpt } from 'src/common/interfaces/find-opt.interface';
import { MarcaEntity } from '../marca.entity';

/**
 * Interface com as opções de busca da entidade Marca
 */
export interface IOptMarca extends IFindOpt {
  nome?: IColumnStrOpt;
  descricao?: IColumnStrOpt;
  nomeUnique?: string;
}
