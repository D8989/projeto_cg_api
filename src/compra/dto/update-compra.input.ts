import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { PutCompraInput } from './put-compra.input';

@InputType()
export class UpdateCompraInput extends PutCompraInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}
