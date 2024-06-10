import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaEntity } from './loja.entity';
import { LojaResolver } from './loja.resolver';
import { LojaService } from './loja.service';
import { LojaRepo } from './loja.repo';
import { LojaController } from './loja.controller';
import { TipoLojaModule } from 'src/tipo-loja/tipo-loja.module';

@Module({
  imports: [TypeOrmModule.forFeature([LojaEntity]), TipoLojaModule],
  providers: [LojaResolver, LojaService, LojaRepo],
  controllers: [LojaController],
  exports: [LojaService],
})
export class LojaModule {}
