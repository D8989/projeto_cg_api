import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TipoItemBaseService } from './tipo_item_base.service';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import { CreateTipoItemBaseInput } from './dto/create-tipo_item_base.input';
import { UpdateTipoItemBaseInput } from './dto/update-tipo_item_base.input';

@Resolver(() => TipoItemBaseEntity)
export class TipoItemBaseResolver {
  constructor(private readonly tipoItemBaseService: TipoItemBaseService) {}

  @Mutation(() => TipoItemBaseEntity)
  createTipoItemBase(
    @Args('createTipoItemBaseInput')
    createTipoItemBaseInput: CreateTipoItemBaseInput,
  ) {
    return this.tipoItemBaseService.create(createTipoItemBaseInput);
  }

  @Query(() => [TipoItemBaseEntity], { name: 'tipoItemBases' })
  findAll() {
    return this.tipoItemBaseService.findAll();
  }

  @Query(() => TipoItemBaseEntity, { name: 'tipoItemBase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tipoItemBaseService.findOne(id);
  }

  @Mutation(() => TipoItemBaseEntity)
  async updateTipoItemBase(
    @Args('updateTipoItemBaseInput')
    updateTipoItemBaseInput: UpdateTipoItemBaseInput,
  ) {
    let { id, ...dto } = updateTipoItemBaseInput;

    return await this.tipoItemBaseService.update(id, dto);
  }

  @Mutation(() => String)
  async removeTipoItemBase(@Args('id', { type: () => Int }) id: number) {
    await this.tipoItemBaseService.hardDelete(id);
    return 'Tipo item-base removido com sucesso';
  }
}
