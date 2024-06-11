import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LojaEntity } from './loja.entity';
import { LojaService } from './loja.service';
import { ListLojaDto } from './dto/list-loja.dto';
import { ListLojaOptionsDto } from './dto/list-loja-options.dto';
import { CreateLojaInput } from './dto/create-loja.input';
import { EnderecoDto } from 'src/endereco/dto/endereco.dto';
import { TipoLojaEntity } from 'src/tipo-loja/tipo-loja.entity';

@Resolver(() => LojaEntity)
export class LojaResolver {
  constructor(private lojaService: LojaService) {}

  @Query(() => ListLojaDto, { name: 'lojas' })
  async listLojas(
    @Args({ name: 'options', type: () => ListLojaOptionsDto, nullable: true })
    opt?: ListLojaOptionsDto,
  ) {
    try {
      return new ListLojaDto(
        await this.lojaService.findPaginado(new ListLojaOptionsDto(opt)),
      );
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => LojaEntity, { name: 'createLoja' })
  async createLoja(
    @Args({ name: 'dto', type: () => CreateLojaInput })
    createDto: CreateLojaInput,
  ) {
    try {
      return await this.lojaService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @ResolveField('endereco', () => EnderecoDto)
  async getEndereco(@Parent() loja: LojaEntity) {
    return await this.lojaService.getEndereco(loja);
  }

  @ResolveField('tipoLoja', () => TipoLojaEntity)
  async getTipoLoja(@Parent() loja: LojaEntity) {
    if (loja.tipoLoja) {
      return loja.tipoLoja;
    }
    const tipo = await this.lojaService.getTipoLoja(loja);
    return tipo
      ? tipo
      : new TipoLojaEntity({ id: 0, nome: 'Desconhecido', descricao: '-' });
  }
}
