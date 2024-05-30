import { Module } from '@nestjs/common';
import { ItemBaseModule } from 'src/item_base/item_base.module';
import { TipoItemBaseModule } from 'src/tipo_item_base/tipo_item_base.module';
import { LoaderService } from './loader.service';
import { MarcaModule } from 'src/marca/marca.module';

// Módulo para tentar organizar as funções do dataloader
@Module({
  imports: [ItemBaseModule, TipoItemBaseModule, MarcaModule],
  providers: [LoaderService],
  exports: [LoaderService],
})
export class LoaderModule {}
