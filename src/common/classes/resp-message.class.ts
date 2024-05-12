import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RespMessageClass {
  @Field(() => Int, {
    nullable: true,
    description: 'Identificador da entidade em questão',
  })
  id?: number;

  @Field(() => String)
  message: string;

  constructor(obj: RespMessageClass) {
    Object.assign(this, obj);
  }
}
