import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TipoLojaEntity } from './tipo-loja.entity';
import { TipoLojaService } from './tipo-loja.service';
import { ListTipoLojaDto } from './dto/list-tipo-loja.dto';
import { ListTipoLojaOptionsDto } from './dto/list-tipo-loja-options.dto';
import { CreateTipoLojaInput } from './dto/create-tipo-loja.input';
import { UpdateTipoLojaInput } from './dto/update-tipo-loja.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

@Resolver(() => TipoLojaEntity)
export class TipoLojaResolver {
  constructor(private tipoLojaService: TipoLojaService) {}

  @Query(() => ListTipoLojaDto, { name: 'tiposLoja' })
  async listTipoLojas(
    @Args({
      name: 'options',
      type: () => ListTipoLojaOptionsDto,
      nullable: true,
    })
    listOpt?: ListTipoLojaOptionsDto,
  ) {
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

  @Mutation(() => TipoLojaEntity, { name: 'createTipoLoja' })
  async createTipoLoja(
    @Args({ name: 'dto', type: () => CreateTipoLojaInput })
    createDto: CreateTipoLojaInput,
  ) {
    try {
      return await this.tipoLojaService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => TipoLojaEntity, { name: 'updateTipoLoja' })
  async editTipoLoja(
    @Args({ name: 'dto', type: () => UpdateTipoLojaInput })
    editDto: UpdateTipoLojaInput,
  ) {
    try {
      const { id, ...dto } = editDto;

      return await this.tipoLojaService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => TipoLojaEntity, { name: 'tipoLoja' })
  async visualizeTipoLoja(
    @Args({ name: 'id', type: () => Int })
    id: number,
  ) {
    try {
      return this.tipoLojaService.visualizarTipo(id);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => RespMessageClass, { name: 'deactivateTipoLoja' })
  async deactivateTipoLoja(@Args({ name: 'id', type: () => Int }) id: number) {
    try {
      await this.tipoLojaService.softDelete(id);
      return new RespMessageClass({
        id: id,
        message: 'Tipo-loja desativado com sucesso',
      });
    } catch (error) {
      throw error;
    }
  }
}
