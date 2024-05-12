import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class DeactivateMarcaInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}
