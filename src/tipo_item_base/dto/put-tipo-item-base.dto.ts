import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class PutTipoItemBaseDto {
  @Field(() => String, { nullable: true, description: 'nome do tipo' })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nome?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Explicação sobre o tipo',
  })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  descricao?: string;
}
