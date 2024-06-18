import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { ListCompraDto } from './dto/list-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';

@Controller('compra')
@ApiTags('Compra')
export class CompraController {
  constructor(private compraService: CompraService) {}

  @Post('/list')
  @ApiOkResponse({
    type: ListCompraDto,
  })
  @ApiBody({ required: false, type: () => ListCompraOptionsDto })
  async listCompras(@Body() listOpt?: ListCompraOptionsDto) {
    try {
      return new ListCompraDto(
        await this.compraService.listPaginado(
          new ListCompraOptionsDto(listOpt),
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
