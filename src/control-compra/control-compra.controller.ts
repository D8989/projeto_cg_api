import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ControlCompraService } from './control-compra.service';
import { RespMessageClass } from 'src/common/classes/resp-message.class';
import { AddItemCompraDto } from './dto/add-item-compra.dto';
import { AddPagamentoDto } from './dto/add-pagamento.dto';

@Controller('control-compra')
@ApiTags('Controlador de Compras')
export class ControlCompraController {
  constructor(private controlCompraService: ControlCompraService) {}

  @Post('/add-item-compra')
  @ApiOkResponse({ type: RespMessageClass })
  @ApiBody({ type: AddItemCompraDto })
  async addItemCompra(@Body() dto: AddItemCompraDto) {
    try {
      await this.controlCompraService.addItem(dto);

      return new RespMessageClass({
        id: dto.compraId,
        message: 'Item adicionado com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('compra/:compra_id/item-compra/:id')
  @ApiOkResponse({ type: RespMessageClass })
  async rmItemCompra(
    @Param('compra_id', ParseIntPipe) compraId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.controlCompraService.rmItemCompra({
        compraId,
        itemCompraIds: [id],
      });

      return new RespMessageClass({
        id: compraId,
        message: 'Item removido com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/add-pagamento')
  @ApiOkResponse({ type: RespMessageClass })
  @ApiBody({ type: AddPagamentoDto })
  async addPagamentoCompra(@Body() dto: AddPagamentoDto) {
    try {
      await this.controlCompraService.addPagamento(dto);

      return new RespMessageClass({
        id: dto.compraId,
        message: 'Pagamento adicionado com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }
}
