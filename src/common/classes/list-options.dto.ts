import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IFindOpt } from '../interfaces/find-opt.interface';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class ListOptionsDto implements IFindOpt {
  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsInt()
  @IsOptional()
  limite?: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsInt()
  @IsOptional()
  offset?: number;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  @IsOptional()
  ordenarPor?: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  ordem?: 'ASC' | 'DESC';

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  @IsOptional()
  buscaSimples?: string;

  constructor(partial?: Partial<ListOptionsDto>) {
    this.limite = partial?.limite;
    this.offset = partial?.offset;
    this.ordenarPor = partial?.ordenarPor;
    this.ordem = partial?.ordem;
    this.buscaSimples = partial?.buscaSimples;
  }
}
