import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateTipoLojaInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  descricao?: string;
}
