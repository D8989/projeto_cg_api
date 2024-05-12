import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IFindOpt } from '../interfaces/find-opt.interface';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ListOptionsDto implements IFindOpt {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  limite?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  offset?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  ordenarPor?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  ordem?: 'ASC' | 'DESC';

  constructor(partial?: Partial<ListOptionsDto>) {
    this.limite = partial?.limite;
    this.offset = partial?.offset;
    this.ordenarPor = partial?.ordenarPor;
    this.ordem = partial?.ordem;
  }
}
