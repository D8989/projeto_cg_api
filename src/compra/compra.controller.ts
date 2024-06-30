import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';
import { ListViewCompraDto } from './dto/list-view-compra.dto';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';
import { ViewListCompraDto } from './dto/view-list-compra.dto';
import { CreateCompraInput } from './dto/create-compra.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';
import { PutCompraInput } from './dto/put-compra.input';
import { ViewCompraRest } from './dto/view-compra-rest.dto';

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

  @Put('/:id')
  @ApiOkResponse({ type: RespMessageClass })
  @ApiBody({ required: true, type: () => PutCompraInput })
  async updateCompra(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: PutCompraInput,
  ) {
    try {
      if (updateDto.dataCompraStr) {
        updateDto.dataCompra = new Date(updateDto.dataCompraStr);
      }

      await this.compraService.update(id, updateDto);
      return new RespMessageClass({
        id: id,
        message: 'Compra editada com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id/soft')
  @ApiOkResponse({ type: RespMessageClass })
  async deactovateCompra(@Param('id', ParseIntPipe) id: number) {
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

  @Get('/:id')
  @ApiOkResponse({ type: ViewCompraRest })
  async visualisarCompra(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.compraService.findCompraRest(id);
    } catch (error) {
      throw error;
    }
  }
}
