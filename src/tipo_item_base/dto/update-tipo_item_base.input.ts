import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTipoItemBaseInput } from './create-tipo_item_base.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTipoItemBaseInput extends PartialType(
  CreateTipoItemBaseInput,
) {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true, description: 'nome do tipo' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nome?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Explicação sobre o tipo',
  })
  @IsString()
  @IsOptional()
  descricao?: string;
}
