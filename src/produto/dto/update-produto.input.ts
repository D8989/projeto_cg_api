import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { PutProdutoDto } from './put-produto.dto';

@InputType()
export class UpdateProdutoInput extends PutProdutoDto {
  @Field(() => Int)
  @IsInt()
  id: number;
}
