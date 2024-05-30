import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MarcaService } from './marca.service';
import { MarcaEntity } from './marca.entity';
import { CreateMarcaInput } from './dto/create-marca.input';
import { DataSource } from 'typeorm';
import { ListMarcaDto } from './dto/list-marca.dto';
import { ListMarcaOptionsDto } from './dto/list-marca-options.dto';
import { DeactivateMarcaInput } from './dto/deactivate-marca.input';
import { RespMessageClass } from 'src/common/classes/resp-message.class';

@Resolver(() => MarcaEntity)
export class MarcaResolver {
  constructor(
    private marcaService: MarcaService,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => MarcaEntity)
  async createMarca(
    @Args({ name: 'createDto', type: () => CreateMarcaInput })
    createDto: CreateMarcaInput,
  ) {
    try {
      return await this.marcaService.createMarca(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => ListMarcaDto, { name: 'marcas' })
  async listMarcas(
    @Args({ name: 'listOpt', type: () => ListMarcaOptionsDto, nullable: true })
    opt?: ListMarcaOptionsDto,
  ) {
    return await this.marcaService
      .getMarcasPaginada(new ListMarcaOptionsDto(opt))
      .then((resp) => {
        return new ListMarcaDto(resp);
      });
  }

  @Mutation(() => RespMessageClass, { name: 'softDeleteMarca' })
  async deactivateMarca(
    @Args({ name: 'deactivateDto', type: () => DeactivateMarcaInput })
    deactivateDto: DeactivateMarcaInput,
  ) {
    try {
      const marcaDeleted = await this.marcaService.softDeleteMarca(
        deactivateDto,
      );
      return new RespMessageClass({
        id: marcaDeleted.id,
        message: `Marca "${marcaDeleted.nome}" desativada com sucesso!`,
      });
    } catch (error) {
      throw error;
    }
  }

  @Query(() => MarcaEntity, { name: 'marca' })
  async viewMarca(
    @Args({ name: 'id', type: () => Int })
    id: number,
  ) {
    try {
      return await this.marcaService.fetchMarca(id);
    } catch (error) {
      throw error;
    }
  }
}
