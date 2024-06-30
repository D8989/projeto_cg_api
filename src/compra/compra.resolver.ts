import {
  Args,
  Int,
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
import { UpdateCompraInput } from './dto/update-compra.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

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

  @Mutation(() => RespMessageClass, { name: 'updateCompra' })
  async updateCompra(
    @Args({ name: 'updateDto', type: () => UpdateCompraInput })
    updateDto: UpdateCompraInput,
  ) {
    try {
      const { id, ...dto } = updateDto;
      if (dto.dataCompraStr) {
        dto.dataCompra = new Date(dto.dataCompraStr);
      }
      await this.compraService.update(id, dto);
      return new RespMessageClass({
        id: id,
        message: 'Compra editada com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => RespMessageClass, { name: 'softDeleteCompra' })
  async removeCompra(@Args({ name: 'id', type: () => Int }) id: number) {
    try {
      await this.compraService.deactivate(id);
      return new RespMessageClass({
        id: id,
        message: 'Compra removida com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @ResolveField(() => LojaEntity, { name: 'loja' })
  async getLoja(@Parent() compra: CompraEntity) {
    return await this.compraService.getLojaByLoader(compra);
  }
}
