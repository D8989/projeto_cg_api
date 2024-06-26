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
import { ItemBaseService } from './item_base.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItemBaseEntity } from './item_base.entity';
import { ListItemBaseOptionsInput } from './dto/list-item-base-options.input';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { PutItemBaseDto } from './dto/put-item-base.dto';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';

@Controller('item-base')
@ApiTags('Item-base')
export class ItemBaseController {
  constructor(private itemBaseService: ItemBaseService) {}

  @Post('/list')
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

  @Get('/:id')
  @ApiOkResponse({
    description: 'Retorno de um tipo item-base',
    type: () => ItemBaseEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'Item informado não encontrado' })
  async getTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      const listOpt = new ListItemBaseOptionsInput();
      return await this.itemBaseService.fetchOne(id, listOpt.toSelectBase());
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Criação do novo tipo de item-base',
    type: () => ItemBaseEntity,
  })
  @ApiBadRequestResponse({ description: 'Erro das regras de criação do tipo' })
  async createTipo(@Body() createTipoDto: CreateItemBaseInput) {
    try {
      const item = await this.itemBaseService.create(createTipoDto);
      const tipo = await this.itemBaseService.getTipo(item);
      return new ItemBaseEntity({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        tipoItemBase: new TipoItemBaseEntity({
          id: tipo.id,
          nome: tipo.nome,
          descricao: tipo.descricao,
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Nome alterado com sucesso',
    type: () => ItemBaseEntity,
  })
  @ApiBadRequestResponse({
    description: 'Erro das regras de alteração do item-base',
  })
  async patchNome(
    @Param('id', ParseIntPipe) id: number,
    @Body() putDto: PutItemBaseDto,
  ) {
    try {
      const item = await this.itemBaseService.update(id, putDto);
      const tipo = await this.itemBaseService.getTipo(item);
      return new ItemBaseEntity({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        tipoItemBase: new TipoItemBaseEntity({
          id: tipo.id,
          nome: tipo.nome,
          descricao: tipo.descricao,
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Item-base removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Item-base informado não existe.' })
  async hardDeleteTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.itemBaseService.remove(id, true);
      return { message: 'Tipo item-base removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/soft-delete')
  @ApiOkResponse({ description: 'Item-base desativado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Item-base informado não existe.' })
  async softDeleteTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.itemBaseService.remove(id, false);
      return { message: 'Tipo item-base desativado com sucesso' };
    } catch (error) {
      throw error;
    }
  }
}
