import { InputType, Field, Int } from '@nestjs/graphql';
import { PutItemBaseDto } from './put-item-base.dto';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateItemBaseInput extends PutItemBaseDto {
  @Field(() => Int)
  @IsInt()
  id: number;
}
