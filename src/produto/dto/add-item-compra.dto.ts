import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsNumberStringDecimal } from 'src/common/decorators/is-number-string-decimal.decorator';

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
  @IsNumberStringDecimal(3, {
    message: 'Texto númerico deve der no máximo 3 decimais separado por ponto',
  })
  quantidadeStr: string;

  quantidade: number;
}
