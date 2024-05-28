import { Module } from '@nestjs/common';
import { ItemBaseModule } from 'src/item_base/item_base.module';
import { TipoItemBaseModule } from 'src/tipo_item_base/tipo_item_base.module';
import { LoaderService } from './loader.service';

// Módulo para tentar organizar as funções do dataloader
@Module({
  imports: [ItemBaseModule, TipoItemBaseModule],
  providers: [LoaderService],
  exports: [LoaderService],
})
export class LoaderModule {}
