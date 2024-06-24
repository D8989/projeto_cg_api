import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ControlCompraService } from './control-compra.service';
import { RespMessageClass } from 'src/common/classes/resp-message.class';
import { AddItemCompraDto } from './dto/add-item-compra.dto';

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
}
