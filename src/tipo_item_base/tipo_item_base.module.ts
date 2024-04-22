import { Module } from '@nestjs/common';
import { TipoItemBaseService } from './tipo_item_base.service';
import { TipoItemBaseResolver } from './tipo_item_base.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoItemBaseEntity } from './tipo_item_base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoItemBaseEntity]), TipoItemBaseModule],
  providers: [TipoItemBaseResolver, TipoItemBaseService],
  exports: [TipoItemBaseService],
})
export class TipoItemBaseModule {}
