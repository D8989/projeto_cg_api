import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptTipoLoja } from '../interfaces/opt-tipo-loja.interface';

@InputType()
class BaseListTipoLojaOptionsDto extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  nomeUnique?: string;

  withBasicSelect?: boolean;
  selects?: string[];

  constructor(partial?: Partial<BaseListTipoLojaOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@InputType()
export class ListTipoLojaOptionsDto extends BaseListTipoLojaOptionsDto {
  private basicSelect: string[];
  constructor(partial?: Partial<BaseListTipoLojaOptionsDto>) {
    super(partial);
    this.basicSelect = ['id', 'nome', 'descricao'];
  }

  toIFindTipoLoja(): IOptTipoLoja {
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
      nomeUnique: this.nomeUnique,
      select: this.withBasicSelect ? this.basicSelect : this.selects,
    };
  }
}
