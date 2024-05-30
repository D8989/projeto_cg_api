import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

@InputType()
export class DeactivateMarcaInput {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  id: number;
}
