import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ControlCompraService } from './control-compra.service';
import { RespMessageClass } from 'src/common/classes/resp-message.class';
import { AddItemCompraDto } from './dto/add-item-compra.dto';
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class ControlCompraResolver {
  constructor(private service: ControlCompraService) {}

  @Mutation(() => RespMessageClass, { name: 'addItemCompra' })
  async addItemCompra(
    @Args({ name: 'dto', type: () => AddItemCompraDto }) dto: AddItemCompraDto,
  ) {
    try {
      await this.service.addItem(dto);

      return new RespMessageClass({
        id: dto.compraId,
        message: 'Item adicionado à compra com sucesso',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
