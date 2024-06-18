import { Args, Query, Resolver } from '@nestjs/graphql';
import { CompraEntity } from './compra.entity';
import { CompraService } from './compra.service';
import { ListCompraDto } from './dto/list-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';

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
}
