import { Module } from '@nestjs/common';
import { CompraModule } from 'src/compra/compra.module';
import { ItemCompraModule } from 'src/item-compra/item-compra.module';
import { PagamentoModule } from 'src/pagamento/pagamento.module';
import { ProdutoModule } from 'src/produto/produto.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ControlCompraService } from './control-compra.service';
import { ControlCompraController } from './control-compra.controller';
import { ControlCompraResolver } from './control-compra.resolver';

@Module({
  imports: [
    CompraModule,
    ItemCompraModule,
    ProdutoModule,
    PagamentoModule,
    UsuarioModule,
  ],
  providers: [ControlCompraService, ControlCompraResolver],
  controllers: [ControlCompraController],
})
export class ControlCompraModule {}
