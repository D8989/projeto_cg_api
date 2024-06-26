import { InputType, Int, Field } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTipoItemBaseInput {
  @Field(() => String, { description: 'nome do tipo' })
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Field(() => String, {
    nullable: true,
    description: 'Explicação sobre o tipo',
  })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  descricao?: string;
}
