import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsIsoUtcDateStr } from 'src/common/decorators/is-iso-utc-date-str.decorator';

@InputType()
export class CreateCompraInput {
  @Field(() => String, { description: 'Formato ISO-string' })
  @ApiProperty({ type: Date, format: 'ISO-string' })
  @IsIsoUtcDateStr({ message: 'Data informada não está em um formato válido' })
  dataCompraStr: string;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  lojaId: number;

  dataCompra: Date;
}
