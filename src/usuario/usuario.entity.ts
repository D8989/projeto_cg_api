import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuario', { schema: process.env.SCHEMA })
@ObjectType()
export class UsuarioEntity {
  @Field(() => Int)
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @ApiProperty({ type: String })
  @Column('varchar', { length: 100 })
  nome: string;

  @Column('varchar', { length: 100 })
  nomeUnique: string;

  constructor(partial: Partial<UsuarioEntity>) {
    Object.assign(this, partial);
  }
}
