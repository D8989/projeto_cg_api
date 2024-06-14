import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';
import { UsuarioRepo } from './usuario.repo';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioResolver, UsuarioService, UsuarioRepo],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
