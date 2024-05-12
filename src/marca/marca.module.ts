import { Module } from '@nestjs/common';
import { MarcaResolver } from './marca.resolver';
import { MarcaService } from './marca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import { MarcaRepo } from './marca.repo';

@Module({
  imports: [TypeOrmModule.forFeature([MarcaEntity])],
  providers: [MarcaResolver, MarcaService, MarcaRepo],
  exports: [MarcaService],
})
export class MarcaModule {}
