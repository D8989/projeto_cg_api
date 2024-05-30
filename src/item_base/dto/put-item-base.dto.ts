import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class PutItemBaseDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  @Transform(({ value, obj }) => {
    if (value) {
      obj.nome = StringFunctionsClass.firstLetterUppercase(value.trim());
    }
    return value;
  })
  @IsOptional()
  nome?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsInt()
  @IsOptional()
  tipoItemBaseId?: number;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  @IsOptional()
  descricao?: string;
}
