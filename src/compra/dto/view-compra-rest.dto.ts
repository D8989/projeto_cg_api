import { ApiProperty } from '@nestjs/swagger';
import { ViewListCompraDto } from './view-list-compra.dto';
import { ViewItemCompraRest } from 'src/item-compra/dto/view-item-compra-rest.dto';
import { CompraEntity } from '../compra.entity';
import { NumberFunctions } from 'src/common/functions/number-functions.class';
import { ViewPagamentoRestDto } from 'src/pagamento/dto/view-pagamento-rest.dto';

export class ViewCompraRest extends ViewListCompraDto {
  @ApiProperty({ type: () => ViewItemCompraRest, isArray: true })
  itens: ViewItemCompraRest[];

  @ApiProperty({ type: () => ViewPagamentoRestDto, isArray: true })
  pagamentos: ViewPagamentoRestDto[];

  constructor(compraEntity: CompraEntity) {
    super({
      codigo: compraEntity.codigo,
      dataCompra: compraEntity.dataCompra,
      lojaNome: compraEntity.loja.nome,
      id: compraEntity.id,
      valorTotal: compraEntity.itens.reduce(
        (prev, item) =>
          prev + NumberFunctions.round(item.custo * item.quantidade),
        0,
      ),
    });

    this.itens = compraEntity.itens.map((i) => ({
      id: i.id,
      custo: i.custo,
      gramatura: i.gramatura,
      produtoNome: i.produto.nome,
      quantidade: i.quantidade,
    }));

    this.pagamentos = compraEntity.pagamentos.map((p) => ({
      id: p.id,
      formaPagamento: p.formaPagamento,
      valor: p.valor,
      usuarioNome: p.usuario.nome,
    }));
  }
}
