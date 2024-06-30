import { Injectable } from '@nestjs/common';
import { PagamentoRepo } from './pagamento.repo';
import { ListPagamentoOptionsDto } from './dto/list-pagamento-options.dto';
import { EntityManager } from 'typeorm';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoEntity } from './pagamento.entity';

@Injectable()
export class PagamentoService {
  constructor(private pagamentoRepo: PagamentoRepo) {}

  async findOnePagamento(listOpt: ListPagamentoOptionsDto) {
    return await this.pagamentoRepo.findOne(listOpt.toPagamentoOpt());
  }

  async insert(createDto: CreatePagamentoDto, ent?: EntityManager) {
    const pagamento = new PagamentoEntity({
      compraId: createDto.compraId,
      formaPagamento: createDto.formaPagamento,
      usuarioId: createDto.usuarioId,
      valor: createDto.valor,
    });

    return await this.pagamentoRepo.save(pagamento, ent);
  }

  async remove(pagamento: PagamentoEntity, ent: EntityManager) {
    await this.pagamentoRepo.hardDelete(pagamento, ent);
  }
}
