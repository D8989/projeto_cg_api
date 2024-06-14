import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCompraEntity } from './item-compra.entity';
import { ItemCompraResolver } from './item-compra.resolver';
import { ItemCompraService } from './item-compra.service';
import { ItemCompraRepo } from './item-compra.repo';
import { ItemCompraController } from './item-compra.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCompraEntity])],
  providers: [ItemCompraResolver, ItemCompraService, ItemCompraRepo],
  controllers: [ItemCompraController],
  exports: [ItemCompraService],
})
export class ItemCompraModule {}
