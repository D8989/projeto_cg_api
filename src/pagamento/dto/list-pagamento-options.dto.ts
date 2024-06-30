import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptPagamento } from '../interfaces/opt-pagamento.interface';
import { IColumnStrOpt } from 'src/common/interfaces/column-string-opt.interface';

class BaseListPagamentoOptionsDto extends ListOptionsDto {
  compraIds?: number[];
  nomeUsuario?: IColumnStrOpt;
  nomeUsuarioUnique?: string;

  withUsuario?: {
    isInner?: boolean;
  };

  constructor(partial: Partial<BaseListPagamentoOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class ListPagamentoOptionsDto extends BaseListPagamentoOptionsDto {
  constructor(partial: BaseListPagamentoOptionsDto) {
    super(partial);
  }

  toPagamentoOpt(): IOptPagamento {
    return {
      ...this,
      customSelect: this.buildCustomSelect(),
    };
  }

  private buildCustomSelect() {
    const obj: MyObject = {};
    if (this.withUsuario || this.nomeUsuario || this.nomeUsuarioUnique) {
      obj['u'] = {
        colums: ['id', 'nome'],
        isInner: this.withUsuario?.isInner,
      };
    }
    return obj;
  }
}
