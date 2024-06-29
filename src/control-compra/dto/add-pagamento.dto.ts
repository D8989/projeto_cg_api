import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { FormaPagamentoEnum } from 'src/common/enum/forma-pagamento.enum';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class AddPagamentoDto {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  compraId: number;

  @Field(() => FormaPagamentoEnum)
  @ApiProperty({
    type: () => FormaPagamentoEnum,
    enum: FormaPagamentoEnum,
    enumName: 'Forma pagamento',
  })
  @IsEnum(FormaPagamentoEnum)
  formaPagamento: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nomeUsuario: string;

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
  valor: number;
}
