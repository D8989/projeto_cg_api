import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { ListViewCompraDto } from './dto/list-view-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';

@Controller('compra')
@ApiTags('Compra')
export class CompraController {
  constructor(private compraService: CompraService) {}

  @Post('/list')
  @ApiOkResponse({
    type: ListViewCompraDto,
  })
  @ApiBody({ required: false, type: () => ListCompraOptionsDto })
  async listCompras(@Body() listOpt?: ListCompraOptionsDto) {
    try {
      return new ListViewCompraDto(
        await this.compraService.getViewListCompraPaginado(
          new ListCompraOptionsDto(listOpt),
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
