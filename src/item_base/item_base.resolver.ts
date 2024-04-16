import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemBaseService } from './item_base.service';
import { ItemBase } from './entities/item_base.entity';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { UpdateItemBaseInput } from './dto/update-item_base.input';

@Resolver(() => ItemBase)
export class ItemBaseResolver {
  constructor(private readonly itemBaseService: ItemBaseService) {}

  @Mutation(() => ItemBase)
  createItemBase(
    @Args('createItemBaseInput') createItemBaseInput: CreateItemBaseInput,
  ) {
    return this.itemBaseService.create(createItemBaseInput);
  }

  @Query(() => [ItemBase], { name: 'itemBase' })
  findAll() {
    return this.itemBaseService.findAll();
  }

  @Query(() => ItemBase, { name: 'itemBase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.itemBaseService.findOne(id);
  }

  @Mutation(() => ItemBase)
  updateItemBase(
    @Args('updateItemBaseInput') updateItemBaseInput: UpdateItemBaseInput,
  ) {
    return this.itemBaseService.update(
      updateItemBaseInput.id,
      updateItemBaseInput,
    );
  }

  @Mutation(() => ItemBase)
  removeItemBase(@Args('id', { type: () => Int }) id: number) {
    return this.itemBaseService.remove(id);
  }
}
