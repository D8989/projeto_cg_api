import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
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
export class PutProdutoDto {
  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsInt()
  @IsOptional()
  marcaId?: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsInt()
  @IsOptional()
  itemBaseId?: number;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nome?: string;

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
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsIn(['Kg', 'g', 'ml', 'l'])
  @IsOptional()
  gramatura?: string;

  @Field(() => Boolean, { nullable: true })
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  hasEmbalagem?: boolean;
}
