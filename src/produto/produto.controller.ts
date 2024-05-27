import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProdutoService } from './produto.service';
import { ProdutoEntity } from './produto.entity';
import { CreateProdutoInput } from './dto/create-produto.input';

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
}
