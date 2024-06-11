import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnderecoDto } from './endereco.dto';

@InputType()
export class CreateEnderecoInput {
  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  rua: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  numero?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  cep?: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  bairro?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  referencia?: string;

  constructor(partial?: Partial<EnderecoDto>) {
    Object.assign(this, partial);
  }
}
