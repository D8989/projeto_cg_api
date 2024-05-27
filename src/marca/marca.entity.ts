import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import 'dotenv/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity('marca', { schema: process.env.SCHEMA })
@ObjectType()
export class MarcaEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  @Field(() => Int)
  id: number;

  @Column('varchar')
  @ApiProperty({ type: String })
  @Field(() => String)
  nome: string;

  @Column('varchar', { name: 'nome_unique' })
  nomeUnique: string;

  @Column('varchar', { nullable: true })
  @ApiProperty({ type: String })
  @Field(() => String, { nullable: true })
  descricao?: string;

  @Column('timestamptz', { name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'atualizado_em', nullable: true })
  atualizadoEm?: Date;

  @Column('timestamptz', { name: 'desativado_em', nullable: true })
  desativadoEm?: Date;

  constructor(partial: Partial<MarcaEntity>) {
    Object.assign(this, partial);
  }
}
