import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProdutoEntity } from './produto.entity';
import { ProdutoService } from './produto.service';
import { CreateProdutoInput } from './dto/create-produto.input';
import { DataSource } from 'typeorm';
import { ListProdutoDto } from './dto/list-produto.dto';
import { ListProdutoOptionsDto } from './dto/list-produto-options.dto';

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
}
