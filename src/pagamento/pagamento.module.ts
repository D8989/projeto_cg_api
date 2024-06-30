import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoEntity } from './pagamento.entity';
import { PagamentoResolver } from './pagamento.resolver';
import { PagamentoService } from './pagamento.service';
import { PagamentoRepo } from './pagamento.repo';
import { PagamentoController } from './pagamento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoEntity])],
  providers: [PagamentoResolver, PagamentoService, PagamentoRepo],
  controllers: [PagamentoController],
  exports: [PagamentoService],
})
export class PagamentoModule {}
