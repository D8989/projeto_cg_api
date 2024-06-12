import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptLoja } from '../interfaces/loja-options.interface';

@InputType()
class BaseListLojaOptionsDto extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nome?: string;

  nomeUnique?: string;
  withTipoLoja?: boolean;

  constructor(partial?: Partial<BaseListLojaOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@InputType()
export class ListLojaOptionsDto extends BaseListLojaOptionsDto {
  constructor(partial?: Partial<BaseListLojaOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  toIOptLoja(): IOptLoja {
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : null,
      nomeUnique: this.nomeUnique,
      withTipoLoja: this.withTipoLoja || false,
    };
  }
}
