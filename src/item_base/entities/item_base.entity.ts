import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ItemBase {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
