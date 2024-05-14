import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ObjectType()
@Entity('tipo_item_base', { schema: process.env.SCHEMA })
export class TipoItemBaseEntity {
  @Field(() => Int)
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @ApiProperty()
  @Column()
  nome: string;

  @Column({ name: 'nome_unique' })
  nomeUnique: string;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional()
  @Column({ nullable: true })
  descricao?: string;

  constructor(partial: Partial<TipoItemBaseEntity>) {
    Object.assign(this, partial);
  }
}
