import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ObjectType()
export class RespMessageClass {
  @Field(() => Int, {
    nullable: true,
    description: 'Identificador da entidade em questão',
  })
  @ApiPropertyOptional({ type: Number, nullable: true })
  id?: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  message: string;

  constructor(obj: RespMessageClass) {
    Object.assign(this, obj);
  }
}
