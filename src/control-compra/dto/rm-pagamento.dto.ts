import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class RmPagamentoDto {
  @Field(() => Int)
  @IsInt()
  compraId: number;

  @Field(() => Int)
  @IsInt()
  pagamentoId: number;
}
