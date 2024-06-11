import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateEnderecoInput } from 'src/endereco/dto/create-endereco.input';

@InputType()
export class CreateLojaInput {
  @Field(() => String)
  @IsString()
  @MaxLength(100)
  nome: string;

  @Field(() => String)
  @IsString()
  @MaxLength(200)
  apelido: string;

  @Field(() => Number)
  @IsInt()
  tipoLojaId: number;

  @Field(() => CreateEnderecoInput)
  @ValidateNested()
  @Type(() => CreateEnderecoInput)
  enderecoDto: CreateEnderecoInput;
}
