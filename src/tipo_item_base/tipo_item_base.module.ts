import { Module } from '@nestjs/common';
import { TipoItemBaseService } from './tipo_item_base.service';
import { TipoItemBaseResolver } from './tipo_item_base.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import { TipoItemBaseController } from './tipo-item-base.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoItemBaseEntity]), TipoItemBaseModule],
  providers: [TipoItemBaseResolver, TipoItemBaseService],
  controllers: [TipoItemBaseController],
  exports: [TipoItemBaseService],
})
export class TipoItemBaseModule {}
