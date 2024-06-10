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
import { TipoLojaService } from './tipo-loja.service';
import { ListTipoLojaDto } from './dto/list-tipo-loja.dto';
import { ListTipoLojaOptionsDto } from './dto/list-tipo-loja-options.dto';
import { TipoLojaEntity } from './tipo-loja.entity';
import { CreateTipoLojaInput } from './dto/create-tipo-loja.input';
import { PutTipoLojaInput } from './dto/put-tipo-loja.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

@Controller('tipo-loja')
@ApiTags('Tipo loja')
export class TipoLojaController {
  constructor(private tipoLojaService: TipoLojaService) {}

  @Post('/list')
  @ApiOkResponse({
    isArray: false,
    type: () => ListTipoLojaDto,
    description: 'Retorno paginado dos tipo-loja',
  })
  @ApiBody({ type: () => ListTipoLojaOptionsDto, required: false })
  async listTipoLojas(@Body() listOpt?: ListTipoLojaOptionsDto) {
    try {
      return new ListTipoLojaDto(
        await this.tipoLojaService.findPaginado(
          new ListTipoLojaOptionsDto(listOpt),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('')
  @ApiOkResponse({
    isArray: false,
    type: () => TipoLojaEntity,
    description: 'Cria nova entidade tipo-loja',
  })
  @ApiBody({ type: () => CreateTipoLojaInput, required: true })
  async createTipoLoja(@Body() createDto: CreateTipoLojaInput) {
    try {
      const tipo = await this.tipoLojaService.create(createDto);
      return new TipoLojaEntity({
        id: tipo.id,
        nome: tipo.nome,
        descricao: tipo.descricao,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiOkResponse({
    isArray: false,
    type: () => TipoLojaEntity,
    description: 'Altera dados do tipoLoja',
  })
  @ApiBody({ type: () => PutTipoLojaInput, required: true })
  async editarTipoLoja(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PutTipoLojaInput,
  ) {
    try {
      const tipo = await this.tipoLojaService.update(id, dto);
      return new TipoLojaEntity({
        id: tipo.id,
        nome: tipo.nome,
        descricao: tipo.descricao,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    isArray: false,
    type: () => TipoLojaEntity,
    description: 'Retorno de uma entidade tipo-loja',
  })
  async getTipoLoja(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.tipoLojaService.visualizarTipo(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id/soft')
  @ApiOkResponse({
    isArray: false,
    type: () => RespMessageClass,
    description: 'Desativa uma entidade tipo-loja',
  })
  async desativarTipoLoja(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.tipoLojaService.softDelete(id);
      return new RespMessageClass({
        id: id,
        message: 'Tipo-loja desativada com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }
}
