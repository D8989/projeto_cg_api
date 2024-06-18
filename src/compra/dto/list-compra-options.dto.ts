import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ListOptionsDto } from 'src/common/classes/list-options.dto';
import { IOptCompra } from '../interfaces/opt-compra.interface';

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

  withLoja?: boolean;

  constructor(partial?: Partial<BaseListCompraOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@InputType()
export class ListCompraOptionsDto extends BaseListCompraOptionsDto {
  constructor(partial?: Partial<BaseListCompraOptionsDto>) {
    super(partial);
  }

  toIOptCompra(): IOptCompra {
    return {
      ...this,
      lojaNome: this.lojaNome
        ? { value: this.lojaNome, typeOperator: 'ilike' }
        : undefined,
    };
  }
}
