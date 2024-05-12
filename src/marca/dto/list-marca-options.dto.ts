import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptMarca } from '../interface/opt-marca.interface';

@InputType()
class BaseListMarcaOptionsDto extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  descricao?: string;

  constructor(partial?: Partial<BaseListMarcaOptionsDto>) {
    super(partial);
    this.nome = partial?.nome;
    this.descricao = partial?.descricao;
  }
}

@InputType()
export class ListMarcaOptionsDto extends BaseListMarcaOptionsDto {
  constructor(partial?: Partial<BaseListMarcaOptionsDto>) {
    super(partial);
  }
  toIFindMarca(): IOptMarca {
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
      descricao: this.descricao
        ? { value: this.descricao, typeOperator: 'ilike' }
        : undefined,
    };
  }
}
