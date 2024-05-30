import { Module } from '@nestjs/common';
import { MarcaResolver } from './marca.resolver';
import { MarcaService } from './marca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import { MarcaRepo } from './marca.repo';
import { MarcaController } from './marca.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarcaEntity])],
  providers: [MarcaResolver, MarcaService, MarcaRepo],
  controllers: [MarcaController],
  exports: [MarcaService],
})
export class MarcaModule {}
