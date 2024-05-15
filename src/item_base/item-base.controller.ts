import { Body, Controller, Post } from '@nestjs/common';
import { ItemBaseService } from './item_base.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ItemBaseEntity } from './item_base.entity';
import { ListItemBaseOptionsInput } from './dto/list-item-base-options.input';

@Controller('Item-base')
@ApiTags('item-base')
export class ItemBaseController {
  constructor(private itemBaseService: ItemBaseService) {}

  @Post()
  @ApiOkResponse({
    description: 'Retorno da lista dos itens-base',
    type: ItemBaseEntity,
    isArray: true,
  })
  @ApiBody({ required: false, type: ListItemBaseOptionsInput })
  async listTipos(@Body() listOpt?: ListItemBaseOptionsInput) {
    try {
      return await this.itemBaseService.findAll(
        new ListItemBaseOptionsInput(listOpt, true),
      );
    } catch (error) {
      throw error;
    }
  }
  /*
  @Get('/:id')
  @ApiOkResponse({
    description: 'Retorno de um tipo item-base',
    type: () => TipoItemBaseEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'Tipo informado não encontrado' })
  async getTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.tipoItemBaseService.findOne(id, {
        select: ['id', 'nome', 'descricao'],
      });
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Criação do novo tipo de item-base',
    type: () => TipoItemBaseEntity,
  })
  @ApiBadRequestResponse({ description: 'Erro das regras de criação do tipo' })
  async createTipo(@Body() createTipoDto: CreateTipoItemBaseInput) {
    try {
      return await this.tipoItemBaseService.create(createTipoDto);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Nome alterado com sucesso',
    type: () => TipoItemBaseEntity,
  })
  @ApiBadRequestResponse({
    description: 'Errp das regras de alteração do nome do tipo',
  })
  async patchNome(
    @Param('id', ParseIntPipe) id: number,
    @Body() putDto: PutTipoItemBaseDto,
  ) {
    try {
      return await this.tipoItemBaseService.update(id, putDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Tipo item-base removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Tipo informado não existe.' })
  async hardDeleteTipo(@Param('id') id: number) {
    try {
      await this.tipoItemBaseService.hardDelete(id);
      return { message: 'Tipo item-base removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }
  */
}
