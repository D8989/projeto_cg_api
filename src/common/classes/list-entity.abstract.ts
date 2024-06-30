import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class AListEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  total: number;

  constructor(total: number) {
    this.total = total;
  }
}
