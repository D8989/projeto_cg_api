import { CreateItemBaseInput } from './create-item_base.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemBaseInput extends PartialType(CreateItemBaseInput) {
  @Field(() => Int)
  id: number;
}
