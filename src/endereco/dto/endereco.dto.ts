import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class EnderecoDto {
  @Field(() => String)
  @ApiProperty({ type: String })
  rua: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  numero: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  cep: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  cidade: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  bairro: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  referencia: string;
}
