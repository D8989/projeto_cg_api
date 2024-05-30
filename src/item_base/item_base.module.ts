import { Module } from '@nestjs/common';
import { ItemBaseService } from './item_base.service';
import { ItemBaseResolver } from './item_base.resolver';
import { TipoItemBaseModule } from 'src/tipo_item_base/tipo_item_base.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemBaseEntity } from './item_base.entity';
import { ItemBaseRepo } from './item-base.repo';
import { ItemBaseController } from './item-base.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemBaseEntity]), TipoItemBaseModule],
  providers: [ItemBaseResolver, ItemBaseService, ItemBaseRepo],
  controllers: [ItemBaseController],
  exports: [ItemBaseService],
})
export class ItemBaseModule {}
