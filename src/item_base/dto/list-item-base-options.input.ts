import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ListItemBaseOptionsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  buscaSimples?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tipoItemBaseIds?: number[];
}
