import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { PutLojaDto } from './put-loja.dto';

@InputType()
export class UpdateLojaInput extends PutLojaDto {
  @Field(() => Int)
  @IsInt()
  id: number;
}
