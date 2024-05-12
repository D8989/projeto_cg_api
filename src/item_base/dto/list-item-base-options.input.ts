import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptItemBase } from '../interface/opt-item-base.interface';

@InputType()
class BaseListItemBaseOptionsInput extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tipoItemBaseIds?: number[];

  constructor(partial?: Partial<BaseListItemBaseOptionsInput>) {
    super(partial);
    this.buscaSimples;
  }
}

@InputType()
export class ListItemBaseOptionsInput extends BaseListItemBaseOptionsInput {
  constructor(partial?: Partial<BaseListItemBaseOptionsInput>) {
    super(partial);
    this.nome = partial?.nome;
    this.tipoItemBaseIds = partial?.tipoItemBaseIds;
  }
  toIItemBase(): IOptItemBase {
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
    };
  }
}
