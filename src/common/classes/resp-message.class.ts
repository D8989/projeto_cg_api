import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RespMessageClass {
  @Field(() => String)
  message: string;

  constructor(obj: RespMessageClass) {
    Object.assign(this, obj);
  }
}
