import {
  Args,
  Int,
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
import { UpdateLojaInput } from './dto/update-loja.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

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

  @Mutation(() => LojaEntity, { name: 'updateLoja' })
  async updateLoja(
    @Args({ name: 'dto', type: () => UpdateLojaInput })
    updateDto: UpdateLojaInput,
  ) {
    try {
      const { id, ...dto } = updateDto;

      return await this.lojaService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => RespMessageClass, { name: 'deactivateLoja' })
  async deactivateLoja(@Args({ name: 'id', type: () => Int }) id: number) {
    try {
      const lojaDesativada = await this.lojaService.softDelte(id);
      return new RespMessageClass({
        id: lojaDesativada.id,
        message: `Loja "${lojaDesativada.nome}" desativada com sucesso`,
      });
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
