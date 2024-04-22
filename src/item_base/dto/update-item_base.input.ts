import { IsInt, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class UpdateItemBaseInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @Transform(({ value, obj }) => {
    obj.nome = StringFunctionsClass.firstLetterUppercase(value.trim());
    return value;
  })
  @IsOptional()
  nome?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  tipoItemBaseId?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  descricao?: string;
}
