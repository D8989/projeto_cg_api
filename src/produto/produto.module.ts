import { Module } from '@nestjs/common';
import { TipoItemBaseModule } from 'src/tipo_item_base/tipo_item_base.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { MarcaModule } from 'src/marca/marca.module';
import { ProdutoResolver } from './produto.resolver';
import { ProdutoService } from './produto.service';
import { ProdutoRepo } from './produto.repo';
import { ProdutoController } from './produto.controller';
import { ItemBaseModule } from 'src/item_base/item_base.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoEntity]),
    MarcaModule,
    ItemBaseModule,
  ],
  providers: [ProdutoResolver, ProdutoService, ProdutoRepo],
  controllers: [ProdutoController],
  exports: [ProdutoService],
})
export class ProdutoModule {}
