import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
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

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantidade?: number;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsIn(['Kg', 'g', 'ml', 'l'])
  @IsOptional()
  gramatura?: string;

  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  hasEmbalagem: boolean;
}
