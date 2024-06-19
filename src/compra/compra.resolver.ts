import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CompraEntity } from './compra.entity';
import { CompraService } from './compra.service';
import { ListCompraDto } from './dto/list-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';
import { CreateCompraInput } from './dto/create-compra.input';
import { LojaEntity } from 'src/loja/loja.entity';

@Resolver(() => CompraEntity)
export class CompraResolver {
  constructor(private compraService: CompraService) {}

  @Query(() => ListCompraDto, { name: 'compras' })
  async listCompras(
    @Args({ name: 'options', type: () => ListCompraOptionsDto, nullable: true })
    options?: ListCompraOptionsDto,
  ) {
    try {
      return new ListCompraDto(
        await this.compraService.listPaginado(
          new ListCompraOptionsDto(options),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => CompraEntity, { name: 'createCompra' })
  async createCompra(
    @Args({ name: 'createDto', type: () => CreateCompraInput })
    dto: CreateCompraInput,
  ) {
    try {
      dto.dataCompra = new Date(dto.dataCompraStr);
      return await this.compraService.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @ResolveField(() => LojaEntity, { name: 'loja' })
  async getLoja(@Parent() compra: CompraEntity) {
    return await this.compraService.getLojaByLoader(compra);
  }
}
