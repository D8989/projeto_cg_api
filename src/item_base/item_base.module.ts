import { Module } from '@nestjs/common';
import { ItemBaseService } from './item_base.service';
import { ItemBaseResolver } from './item_base.resolver';
import { TipoItemBaseModule } from 'src/tipo_item_base/tipo_item_base.module';

@Module({
  imports: [TipoItemBaseModule],
  providers: [ItemBaseResolver, ItemBaseService],
})
export class ItemBaseModule {}
