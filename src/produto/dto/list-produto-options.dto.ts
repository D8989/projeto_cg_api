import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IOptProduto } from '../interface/opt-produto.interface';

@InputType()
class BaseListProdutoOptionsDto extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  nome?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  descricao?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  marcaNome?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  itemBaseNome?: string;

  constructor(partial?: Partial<BaseListProdutoOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@InputType()
export class ListProdutoOptionsDto extends BaseListProdutoOptionsDto {
  constructor(partial?: Partial<BaseListProdutoOptionsDto>) {
    super(partial);
  }
  toIFindProduto(): IOptProduto {
    return {
      ...this,
      nome: this.nome ? { value: this.nome, typeOperator: 'ilike' } : undefined,
      descricao: this.descricao
        ? { value: this.descricao, typeOperator: 'ilike' }
        : undefined,
      marcaNome: this.marcaNome
        ? { value: this.marcaNome, typeOperator: 'ilike' }
        : undefined,
      itemBaseNome: this.itemBaseNome
        ? { value: this.itemBaseNome, typeOperator: 'ilike' }
        : undefined,
    };
  }
}
