import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraEntity } from './compra.entity';
import { LojaModule } from 'src/loja/loja.module';
import { CompraResolver } from './compra.resolver';
import { CompraService } from './compra.service';
import { CompraRepo } from './compra.repo';
import { CompraController } from './compra.controller';
import { ItemCompraModule } from 'src/item-compra/item-compra.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompraEntity]),
    LojaModule,
    ItemCompraModule,
  ],
  providers: [CompraResolver, CompraService, CompraRepo],
  controllers: [CompraController],
  exports: [CompraService],
})
export class CompraModule {}
