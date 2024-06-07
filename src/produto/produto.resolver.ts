import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProdutoEntity } from './produto.entity';
import { ProdutoService } from './produto.service';
import { CreateProdutoInput } from './dto/create-produto.input';
import { DataSource } from 'typeorm';
import { ListProdutoDto } from './dto/list-produto.dto';
import { ListProdutoOptionsDto } from './dto/list-produto-options.dto';
import { ItemBaseEntity } from 'src/item_base/item_base.entity';
import { MarcaEntity } from 'src/marca/marca.entity';
import { UpdateProdutoInput } from './dto/update-produto.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

@Resolver(() => ProdutoEntity)
export class ProdutoResolver {
  constructor(
    private produtoService: ProdutoService,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => ProdutoEntity, { name: 'createProduto' })
  async createProduto(
    @Args({ name: 'dto', type: () => CreateProdutoInput })
    createDto: CreateProdutoInput,
  ) {
    try {
      return await this.produtoService.createProduto(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => RespMessageClass, { name: 'updateProduto' })
  async updateProduto(
    @Args({ name: 'dto', type: () => UpdateProdutoInput })
    updateDto: UpdateProdutoInput,
  ) {
    try {
      const { id, ...dto } = updateDto;
      await this.produtoService.update(id, dto);
      return new RespMessageClass({
        id,
        message: 'Produto editado com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => RespMessageClass, { name: 'softDeleteProduto' })
  async softDeleteProduto(@Args({ name: 'id', type: () => Int }) id: number) {
    try {
      await this.produtoService.softDelete(id);

      return new RespMessageClass({
        id,
        message: 'Produto desativado com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Query(() => ListProdutoDto, { name: 'produtos' })
  async listProdutos(
    @Args({
      name: 'options',
      type: () => ListProdutoOptionsDto,
      nullable: true,
    })
    listOpt?: ListProdutoOptionsDto,
  ) {
    try {
      return this.produtoService
        .listPaginado(new ListProdutoOptionsDto(listOpt))
        .then((resp) => new ListProdutoDto(resp));
    } catch (error) {
      throw error;
    }
  }

  @Query(() => ProdutoEntity, { name: 'produto' })
  async visualizeProduto(
    @Args({ name: 'id', type: () => Int })
    id: number,
  ) {
    try {
      return this.produtoService.fetchProduto(id);
    } catch (error) {
      throw error;
    }
  }

  @ResolveField('itemBase', () => ItemBaseEntity)
  async getItemBase(@Parent() produto: ProdutoEntity) {
    return await this.produtoService.getItemBaseByLoader(produto);
  }

  @ResolveField('marca', () => MarcaEntity)
  async getMarca(@Parent() produto: ProdutoEntity) {
    return await this.produtoService.getMarcaByLoader(produto);
  }
}
