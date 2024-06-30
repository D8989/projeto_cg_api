import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { IsIsoUtcDateStr } from 'src/common/decorators/is-iso-utc-date-str.decorator';

@InputType()
export class PutCompraInput {
  @Field(() => String, { description: 'Formato ISO-string', nullable: true })
  @ApiProperty({ type: Date, format: 'ISO-string', nullable: true })
  @IsIsoUtcDateStr({ message: 'Data não está no formato ISO-UTC' })
  @IsOptional()
  dataCompraStr?: Date;

  @Field(() => Int, { nullable: true })
  @ApiProperty({ type: Number, nullable: true })
  @IsInt()
  @IsOptional()
  lojaId?: number;

  dataCompra?: Date;
}
