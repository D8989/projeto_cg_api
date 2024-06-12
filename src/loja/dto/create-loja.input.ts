import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateEnderecoInput } from 'src/endereco/dto/create-endereco.input';

@InputType()
export class CreateLojaInput {
  @Field(() => String)
  @ApiProperty({ type: String, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nome: string;

  @Field(() => String)
  @ApiProperty({ type: String, maxLength: 200 })
  @IsString()
  @MaxLength(200)
  apelido: string;

  @Field(() => Number)
  @ApiProperty({ type: Number })
  @IsInt()
  tipoLojaId: number;

  @Field(() => CreateEnderecoInput)
  @ApiProperty({
    type: () => CreateEnderecoInput,
    isArray: false,
    nullable: false,
  })
  @ValidateNested()
  @Type(() => CreateEnderecoInput)
  enderecoDto: CreateEnderecoInput;
}
