import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class AddItemCompraDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  produtoId: number;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  CompraId: number;

  @Field(() => String, {
    description: 'Máximo de 3 casas decimais separado por ponto',
  })
  @ApiProperty({ type: String })
  @Transform(({ obj, value }) => {
    obj.quantidade = StringFunctionsClass.stringToNumberDecimal(value, 3);
    return StringFunctionsClass.stringToNumberDecimal(value, 3);
  })
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: 'formato de quantidade é inválido' },
  )
  quantidade: number;

  @Field(() => String, {
    description: 'Máximo de 2 casas decimais separado por ponto',
  })
  @ApiProperty({ type: String })
  @Transform(({ obj, value }) => {
    obj.precoUnidade = StringFunctionsClass.stringToNumberDecimal(value, 2);
    return StringFunctionsClass.stringToNumberDecimal(value, 2);
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'formato do preço médio inválido' },
  )
  precoUnidade: number;
}
