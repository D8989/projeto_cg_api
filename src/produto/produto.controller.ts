import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProdutoService } from './produto.service';
import { ProdutoEntity } from './produto.entity';
import { CreateProdutoInput } from './dto/create-produto.input';
import { ListProdutoDto } from './dto/list-produto.dto';
import { ListProdutoOptionsDto } from './dto/list-produto-options.dto';
import { PutProdutoDto } from './dto/put-produto.dto';

@Controller('Produto')
@ApiTags('produto')
export class ProdutoController {
  constructor(private produtoService: ProdutoService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Criação do novo Produto',
    type: () => ProdutoEntity,
  })
  @ApiBadRequestResponse({ description: 'Erro das regras de criação de marca' })
  async createTipo(@Body() createDto: CreateProdutoInput) {
    try {
      return await this.produtoService.createProduto(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('/list')
  @ApiOkResponse({
    description: 'Retorno da lista dos produtos paginado',
    type: ListProdutoDto,
  })
  @ApiBody({ required: false, type: () => ListProdutoOptionsDto })
  async listTipos(@Body() listOpt?: ListProdutoOptionsDto) {
    try {
      const opt = new ListProdutoOptionsDto(listOpt);
      opt.bringMarca = true;
      opt.bringItemBase = true;
      opt.withBasicSelect = true;
      return await this.produtoService.listPaginado(opt);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Retorno de um Produto',
    type: () => ProdutoEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'Produto informado não encontrado' })
  async getTipo(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.produtoService.visualizarProduto(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Produto alterado alterado com sucesso',
    type: () => ProdutoEntity,
  })
  @ApiBadRequestResponse({
    description: 'Erro das regras de alteração do produto',
  })
  async patchNome(
    @Param('id', ParseIntPipe) id: number,
    @Body() putDto: PutProdutoDto,
  ) {
    try {
      const p = await this.produtoService.update(id, putDto);
      return new ProdutoEntity({
        id: p.id,
        nome: p.nome,
      });
    } catch (error) {
      throw error;
    }
  }
}
