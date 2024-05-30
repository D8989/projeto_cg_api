import { InputType, Int, Field } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class CreateItemBaseInput {
  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value, obj }) => {
    obj.nome = StringFunctionsClass.firstLetterUppercase(value.trim());
    return value;
  })
  nome: string;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  tipoItemBaseId: number;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  descricao?: string;
}
