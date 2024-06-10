import { Field, InputType, Int } from '@nestjs/graphql';
import { PutTipoLojaInput } from './put-tipo-loja.input';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateTipoLojaInput extends PutTipoLojaInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}
