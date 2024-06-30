import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompraService } from 'src/compra/compra.service';
import { ItemCompraService } from 'src/item-compra/item-compra.service';
import { PagamentoService } from 'src/pagamento/pagamento.service';
import { ProdutoService } from 'src/produto/produto.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AddItemCompraDto } from './dto/add-item-compra.dto';
import { ListCompraOptionsDto } from 'src/compra/dto/list-compra-options.dto';
import { DataSource } from 'typeorm';
import { ListProdutoOptionsDto } from 'src/produto/dto/list-produto-options.dto';
import { ListItemCompraOptionsDto } from 'src/item-compra/dto/list-item-compra-options.dto';
import { ItemCompraEntity } from 'src/item-compra/item-compra.entity';
import { RmItemCompraDto } from './dto/rm-item-compra.dto';
import { CompraEntity } from 'src/compra/compra.entity';
import { ArrayFunctions } from 'src/common/functions/array-functions.class';
import { AddPagamentoDto } from './dto/add-pagamento.dto';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { RmPagamentoDto } from './dto/rm-pagamento.dto';

@Injectable()
export class ControlCompraService {
  constructor(
    private compraService: CompraService,
    private produtoService: ProdutoService,
    private itemCompraService: ItemCompraService,
    private usuarioService: UsuarioService,
    private pagamentoService: PagamentoService,
    private dataSource: DataSource,
  ) {}

  async addItem(dto: AddItemCompraDto) {
    const { compraId, produtoId, quantidade, precoUnidade, gramatura } = dto;
    const [compra, produto] = await Promise.all([
      this.compraService.findOneCompra(
        new ListCompraOptionsDto({
          ids: [compraId],
          withBasicSelect: true,
          withItens: { joinProdutoIds: [produtoId], isInner: false },
        }),
      ),
      this.produtoService.findOneProduto(
        new ListProdutoOptionsDto({
          ids: [produtoId],
          withBasicSelect: true,
        }),
      ),
    ]);

    if (!compra) {
      throw new NotFoundException(
        'Compra Não encontrada para adicionar um item',
      );
    }
    if (!produto) {
      throw new NotFoundException(
        'Produto Não encontrado para adicionar um item',
      );
    }
    const itensEqual = compra.itens.filter((item) => {
      return (
        item.compraId === compraId &&
        item.produtoId === produtoId &&
        item.custo === precoUnidade &&
        item.gramatura === gramatura
      );
    });

    if (itensEqual.length > 1) {
      throw new BadRequestException(
        `Foi encontrado itens iguais na compra de Código ${compra.codigo}`,
      );
    }

    if (itensEqual.length === 0) {
      const itemDuplicado = await this.itemCompraService.findOneItemCompra(
        new ListItemCompraOptionsDto({
          compraIds: [compraId],
          produtoIds: [produtoId],
        }),
      );
      if (itemDuplicado) {
        throw new BadRequestException(
          `Item informado já existe para a compra "${compra.codigo}" e do produto "${produto.nome}"`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let item: ItemCompraEntity;
      const now = new Date();

      if (itensEqual.length === 1) {
        const itemFound = itensEqual[0];
        item = await this.itemCompraService.update(
          itemFound.id,
          {
            quantidade: quantidade + itemFound.quantidade,
          },
          queryRunner.manager,
          { ignoreRules: true },
        );
      } else {
        item = await this.itemCompraService.create(
          {
            compraId: compraId,
            produtoId: produtoId,
            custo: precoUnidade,
            gramatura: gramatura,
            quantidade: quantidade,
          },
          queryRunner.manager,
          { ignoreRules: true },
        );
      }

      await this.compraService.updateColumns(
        compra.id,
        { atualizadoEm: now },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return item;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async rmItemCompra(dto: RmItemCompraDto): Promise<CompraEntity> {
    const { compraId, itemCompraIds } = dto;

    const listOpt = new ListCompraOptionsDto({
      ids: [compraId],
      withItens: { isInner: false, ids: itemCompraIds },
    });
    const compra = await this.compraService.findOneCompra(listOpt);
    if (!compra) {
      throw new NotFoundException(
        'Compra não encontrada para remoção dos itens',
      );
    }
    if (compra.itens.length === 0) {
      throw new NotFoundException('Nenhum item da compra não encontrado');
    }
    if (compra.itens.length !== itemCompraIds.length) {
      throw new NotFoundException(
        'Alguns itens da compra não foram encontrados',
      );
    }
    if (
      !ArrayFunctions.isEqualById(
        compra.itens,
        itemCompraIds.map((id) => ({ id })),
      )
    ) {
      throw new NotFoundException(
        'Itens encontrados são diferentes dos informados',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const now = new Date();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const itensIdsToDelte = compra.itens.map((i) => i.id);
      await this.itemCompraService.hardDeleteByIds(
        itensIdsToDelte,
        queryRunner.manager,
      );

      await this.compraService.updateColumns(
        compra.id,
        { atualizadoEm: now },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return compra;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async addPagamento(dto: AddPagamentoDto) {
    const { compraId, nomeUsuario } = dto;

    const listOpt = new ListCompraOptionsDto({
      ids: [compraId],
      withPagamentos: { isInner: false },
    });
    const compra = await this.compraService.findOneCompra(listOpt);

    if (!compra) {
      throw new NotFoundException(
        'Compra não encontrada para cadastrar pagamento',
      );
    }

    const nomeUsuarioUnq = StringFunctionsClass.toLowerUnaccent(nomeUsuario);
    const pagamentoFound = compra.pagamentos.find(
      (p) => p.usuario.nomeUnique === nomeUsuarioUnq,
    );

    if (pagamentoFound) {
      throw new BadRequestException(
        `Já existe um pagamento para o usuário ${nomeUsuario} para a compra selecionada`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const now = new Date();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usuario = await this.usuarioService.getOrCreate(
        nomeUsuario,
        queryRunner.manager,
      );

      const pagamentoCreated = await this.pagamentoService.insert(
        {
          compraId: compra.id,
          formaPagamento: dto.formaPagamento,
          usuarioId: usuario.id,
          valor: dto.valor,
        },
        queryRunner.manager,
      );

      await this.compraService.updateColumns(
        compra.id,
        { atualizadoEm: now },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return pagamentoCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async rmPagamento(dto: RmPagamentoDto) {
    const { compraId, pagamentoId } = dto;

    const listCompraOpt = new ListCompraOptionsDto({
      ids: [compraId],
      withPagamentos: {
        isInner: false,
      },
    });
    const compra = await this.compraService.findOneCompra(listCompraOpt);
    if (!compra) {
      throw new NotFoundException(
        'Compra não encontrada para a remoção do pagamento',
      );
    }

    const pagFound = compra.pagamentos.find((p) => p.id === pagamentoId);
    if (!pagFound) {
      throw new NotFoundException('Pagamento não encontrado para a remoção');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const now = new Date();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.pagamentoService.remove(pagFound, queryRunner.manager);
      await this.compraService.updateColumns(
        compra.id,
        { atualizadoEm: now },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return compra;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
