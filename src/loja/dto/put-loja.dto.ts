import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoInput } from 'src/endereco/dto/create-endereco.input';

@InputType()
export class PutLojaDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  nome?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true, maxLength: 200 })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  apelido?: string;

  @Field(() => Number, { nullable: true })
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsInt()
  @IsOptional()
  tipoLojaId?: number;

  @Field(() => CreateEnderecoInput, { nullable: true })
  @ApiPropertyOptional({ type: () => CreateEnderecoInput, nullable: true })
  @ValidateNested()
  @Type(() => CreateEnderecoInput)
  @IsOptional()
  enderecoDto?: CreateEnderecoInput;
}
