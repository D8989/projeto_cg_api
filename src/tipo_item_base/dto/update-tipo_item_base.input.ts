import { IsInt } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { PutTipoItemBaseDto } from './put-tipo-item-base.dto';

@InputType()
export class UpdateTipoItemBaseInput extends PutTipoItemBaseDto {
  @Field(() => Int)
  @IsInt()
  id: number;
}
