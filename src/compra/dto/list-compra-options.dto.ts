import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptCompra } from '../interfaces/opt-compra.interface';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@InputType()
class BaseListCompraOptionsDto extends ListOptionsDto {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  codigo?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  lojaNome?: string;

  @Field(() => Date, { nullable: true })
  @ApiPropertyOptional({
    type: Date,
    nullable: true,
    format: 'yyyy-mm-ddThh:mm:ssZ',
  })
  @IsString()
  @IsOptional()
  data?: Date;

  itens?: {
    produtoIds?: number[];
    joinProdutoIds?: number[];
    isInner?: boolean;
  };

  withLoja?: boolean;
  withBasicSelect?: boolean;

  constructor(partial?: Partial<BaseListCompraOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@InputType()
export class ListCompraOptionsDto extends BaseListCompraOptionsDto {
  private basicSelect: string[] = [];
  constructor(partial?: Partial<BaseListCompraOptionsDto>) {
    super(partial);
    this.basicSelect = ['id', 'codigo', 'dataCompra'];
  }

  toIOptCompra(): IOptCompra {
    return {
      ...this,
      lojaNome: this.lojaNome
        ? { value: this.lojaNome, typeOperator: 'ilike' }
        : undefined,
      customSelect: this.buildCustomSelect(),
      select: this.withBasicSelect ? this.basicSelect : undefined,
      itemProdutoIds: this.itens?.produtoIds,
    };
  }

  private buildCustomSelect(): MyObject | undefined {
    const obj: MyObject = {};

    if (this.withLoja) {
      obj['l'] = {
        colums: ['id', 'nome'],
        isInner: true,
      };
    }
    if (this.itens) {
      if (
        (this.itens.produtoIds && this.itens.produtoIds.length > 0) ||
        (this.itens.joinProdutoIds && this.itens.joinProdutoIds.length > 0)
      ) {
        obj['i'] = {
          colums: [
            'id',
            'produtoId',
            'compraId',
            'quantidade',
            'gramatura',
            'custo',
          ],
          isInner: this.itens.isInner,
        };
      }

      if (this.itens.joinProdutoIds && this.itens.joinProdutoIds.length > 0) {
        obj['i'].joinInfo = {
          query: 'i.produtoId IN(:...pIds)',
          parameters: { pIds: this.itens.joinProdutoIds },
        };
      }
    }

    if (ObjectFunctions.isObjectEmpty(obj)) {
      return undefined;
    }
    return obj;
  }
}
