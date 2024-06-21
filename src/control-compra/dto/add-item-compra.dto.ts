import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';
import { EGramatura } from 'src/common/enum/gramatura.enum';
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
  compraId: number;

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
  @IsPositive({ message: 'A quantidade deve ser maior que zero ' })
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
  @IsPositive({ message: 'A quantidade deve ser maior que zero' })
  precoUnidade: number;

  @Field(() => EGramatura)
  @ApiProperty({ type: String, enum: EGramatura })
  @IsEnum(EGramatura, { message: 'Valor da gramatura não é valido' })
  gramatura: EGramatura;
}
