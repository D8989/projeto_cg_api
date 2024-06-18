import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, isDateString } from 'class-validator';
import { IsIsoUtcDateStr } from 'src/common/decorators/is-iso-utc-date-str.decorator';

@InputType()
export class CreateCompraInput {
  @Field(() => String, { description: 'Formato ISO-string' })
  @ApiProperty({ type: Date, format: 'ISO-string' })
  @Transform(({ value, obj }) => {
    obj.dataCompra = new Date(value);
    return new Date(value);
  })
  @IsDate({ message: 'Data informada não está em um formato válido' })
  dataCompra: Date;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  lojaId: number;
}
