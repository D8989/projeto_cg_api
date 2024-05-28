import {
  Args,
  Context,
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
import { IbLoader } from 'src/item_base/item-base.loader';

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

  @ResolveField('itemBase', () => ItemBaseEntity)
  async getItemBase(
    @Parent() produto: ProdutoEntity,
    @Context('ibLoader') ibLoader: IbLoader,
  ) {
    return await ibLoader.load(produto.itemBaseId);
  }
}
