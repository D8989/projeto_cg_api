import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTipoItemBaseInput {
  @Field(() => String, { description: 'nome do tipo' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Field(() => String, {
    nullable: true,
    description: 'Explicação sobre o tipo',
  })
  @IsString()
  @IsOptional()
  descricao?: string;
}
