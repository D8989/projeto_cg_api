import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptItemBase } from '../interface/opt-item-base.interface';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
class BaseListItemBaseOptionsInput extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => [Int], { nullable: true })
  @ApiPropertyOptional({ type: Number, nullable: true, isArray: true })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tipoItemBaseIds?: number[];

  constructor(partial?: Partial<BaseListItemBaseOptionsInput>) {
    super(partial);
    this.nome = partial?.nome;
    this.tipoItemBaseIds = partial?.tipoItemBaseIds;
  }
}

@InputType()
export class ListItemBaseOptionsInput extends BaseListItemBaseOptionsInput {
  private byController?: boolean;
  constructor(partial?: Partial<BaseListItemBaseOptionsInput>, flag?: boolean) {
    super(partial);
    this.byController = flag;
  }
  toIItemBase(): IOptItemBase {
    if (this.byController) {
      return {
        ...this,
        ...this.toSelectBase(),
      };
    }
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
    };
  }

  toSelectBase(): IOptItemBase {
    return {
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
      select: ['id', 'nome', 'descricao'],
      customSelect: {
        tib: ['id', 'nome', 'descricao'],
      },
    };
  }
}
