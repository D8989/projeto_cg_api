import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemBaseService } from './item_base.service';
import { ItemBaseEntity } from './item_base.entity';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { UpdateItemBaseInput } from './dto/update-item_base.input';
import { DataSource } from 'typeorm';
import { ListItemBaseOptionsInput } from './dto/list-item-base-options.input';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Resolver(() => ItemBaseEntity)
export class ItemBaseResolver {
  constructor(
    private itemBaseService: ItemBaseService,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => ItemBaseEntity)
  async createItemBase(
    @Args('createItemBaseInput', { type: () => CreateItemBaseInput })
    createItemBaseInput: CreateItemBaseInput,
  ) {
    return this.itemBaseService.create(createItemBaseInput);
  }

  @Query(() => [ItemBaseEntity], { name: 'itemBases' })
  findAll(
    @Args({
      name: 'options',
      type: () => ListItemBaseOptionsInput,
      nullable: true,
    })
    options?: ListItemBaseOptionsInput,
  ) {
    return this.itemBaseService.findAll(options);
  }

  @Query(() => ItemBaseEntity, { name: 'itemBase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.itemBaseService.findOne(id);
  }

  @Mutation(() => ItemBaseEntity)
  updateItemBase(
    @Args('updateItemBaseInput') updateItemBaseInput: UpdateItemBaseInput,
  ) {
    return this.itemBaseService.update(
      updateItemBaseInput.id,
      updateItemBaseInput,
    );
  }

  @Mutation(() => ItemBaseEntity)
  removeItemBase(@Args('id', { type: () => Int }) id: number) {
    return this.itemBaseService.remove(id);
  }
}
