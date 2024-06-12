import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LojaService } from './loja.service';
import { ListLojaOptionsDto } from './dto/list-loja-options.dto';
import { CreateLojaInput } from './dto/create-loja.input';
import { ViewLojaDto } from './dto/view-loja.dto';
import { ListViewLojaDto } from './dto/list-view-loja.dto';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

@Controller('loja')
@ApiTags('Loja')
export class LojaController {
  constructor(private lojaService: LojaService) {}

  @Post('/list')
  @ApiOkResponse({
    isArray: false,
    type: ListViewLojaDto,
  })
  @ApiBody({ type: ListLojaOptionsDto, required: false })
  async listLojas(@Body() listOpt: ListLojaOptionsDto) {
    try {
      return new ListViewLojaDto(
        await this.lojaService.findViewDtoPaginado(
          new ListLojaOptionsDto(listOpt),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('')
  @ApiOkResponse({
    isArray: false,
    type: ViewLojaDto,
  })
  @ApiBody({ type: CreateLojaInput, required: true })
  async createLoja(@Body() dto: CreateLojaInput) {
    try {
      const loja = await this.lojaService.create(dto);
      return new ViewLojaDto({
        id: loja.id,
        nome: loja.nome,
        apelido: loja.apelido,
        tipoLoja: loja.tipoLoja,
        enderecoDto: await this.lojaService.getEndereco(loja),
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOkResponse({ type: ViewLojaDto })
  async getLoja(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.lojaService.getViewDto(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id/soft')
  @ApiOkResponse({ type: RespMessageClass })
  async deactivateLoja(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.lojaService.softDelte(id);
      return new RespMessageClass({
        id: id,
        message: 'Loja desativada com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }
}
