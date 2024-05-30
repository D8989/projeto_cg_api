import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateMarcaInput {
  @Field(() => String)
  @ApiProperty({ type: String, nullable: false })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descricao?: string;
}
