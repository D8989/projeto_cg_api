import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { ListViewCompraDto } from './dto/list-view-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';
import { ViewListCompraDto } from './dto/view-list-compra.dto';
import { CreateCompraInput } from './dto/create-compra.input';

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

  @Post('/')
  @ApiOkResponse({ type: ViewListCompraDto })
  @ApiBody({ required: true, type: () => CreateCompraInput })
  async createCompra(@Body() createDto: CreateCompraInput) {
    try {
      createDto.dataCompra = new Date(createDto.dataCompraStr);

      return await this.compraService.create(createDto).then((compra) => {
        return this.compraService.entityToListView(compra);
      });
    } catch (error) {
      throw error;
    }
  }
}
