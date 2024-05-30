import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateProdutoInput {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  marcaId: number;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  itemBaseId: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descricao?: string;

  @Field(() => Int)
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  quantidade: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsIn(['Kg', 'g', 'ml', 'l'])
  gramatura: string;
}
