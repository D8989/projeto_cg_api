import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@InputType()
export class CreateItemBaseInput {
  @Field(() => String)
  @IsString()
  @Transform(({ value, obj }) => {
    obj.nome = StringFunctionsClass.firstLetterUppercase(value.trim());
    return value;
  })
  nome: string;

  @Field(() => Int)
  @IsInt()
  tipoItemBaseId: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  descricao?: string;
}
