import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarcaService } from './marca.service';
import { MarcaEntity } from './marca.entity';
import { CreateMarcaInput } from './dto/create-marca.input';
import { ListMarcaDto } from './dto/list-marca.dto';
import { ListMarcaOptionsDto } from './dto/list-marca-options.dto';
import { RespMessageClass } from 'src/common/classes/resp-message.class';
import { DeactivateMarcaInput } from './dto/deactivate-marca.input';

@Controller('marca')
@ApiTags('Marca')
export class MarcaController {
  constructor(private marcaService: MarcaService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Criação de nova marca',
    type: () => MarcaEntity,
  })
  @ApiBadRequestResponse({ description: 'Erro das regras de criação de marca' })
  async createTipo(@Body() createMarcaDto: CreateMarcaInput) {
    try {
      const marca = await this.marcaService.createMarca(createMarcaDto);
      return new MarcaEntity({
        id: marca.id,
        nome: marca.nome,
        descricao: marca.descricao,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('/list')
  @ApiOkResponse({
    description: 'Retorno da lista das marcas paginado',
    type: ListMarcaDto,
  })
  @ApiBody({ required: false, type: () => ListMarcaOptionsDto })
  async listTipos(@Body() listOpt?: ListMarcaOptionsDto) {
    try {
      return await this.marcaService.getMarcasPaginada(
        new ListMarcaOptionsDto(listOpt),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('/soft-delete')
  @ApiResponse({
    description: 'Retorno da mensagem de sucesso',
    type: RespMessageClass,
  })
  @ApiBody({ required: true, type: () => DeactivateMarcaInput })
  async softDeleteMarca(@Body() dto: DeactivateMarcaInput) {
    try {
      const marcaDeleted = await this.marcaService.softDeleteMarca(dto);
      return new RespMessageClass({
        id: marcaDeleted.id,
        message: `Marca "${marcaDeleted.nome}" desativada com sucesso!`,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Retorno de um tipo item-base',
    type: () => MarcaEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'Item informado não encontrado' })
  async getTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.marcaService.fetchMarca(id);
    } catch (error) {
      throw error;
    }
  }
}
