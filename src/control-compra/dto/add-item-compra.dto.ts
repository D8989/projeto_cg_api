import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';
import { EGramatura } from 'src/common/enum/gramatura.enum';

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

  @Field(() => Number, {
    description: 'Máximo de 3 casas decimais separado por ponto',
  })
  @ApiProperty({ type: Number })
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: 'formato de quantidade é inválido' },
  )
  @IsPositive({ message: 'A quantidade deve ser maior que zero ' })
  quantidade: number;

  @Field(() => Number, {
    description: 'Máximo de 2 casas decimais separado por ponto',
  })
  @ApiProperty({ type: String })
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
