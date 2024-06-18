import { Injectable } from '@nestjs/common';
import { CompraRepo } from './compra.repo';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';

@Injectable()
export class CompraService {
  constructor(private compraRepo: CompraRepo) {}

  async listPaginado(opt: ListCompraOptionsDto) {
    opt.limite = opt.limite || 100;

    return await this.compraRepo.findAllAndCount(opt.toIOptCompra());
  }
}
