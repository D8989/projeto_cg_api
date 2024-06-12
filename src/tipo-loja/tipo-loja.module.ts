import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoLojaEntity } from './tipo-loja.entity';
import { TipoLojaResolver } from './tipo-loja.resolver';
import { TipoLojaService } from './tipo-loja.service';
import { TipoLojaRepo } from './tipo-loja.repo';
import { TipoLojaController } from './tipo-loja.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoLojaEntity])],
  providers: [TipoLojaResolver, TipoLojaService, TipoLojaRepo],
  controllers: [TipoLojaController],
  exports: [TipoLojaService],
})
export class TipoLojaModule {}
