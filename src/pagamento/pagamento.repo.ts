import { InjectRepository } from '@nestjs/typeorm';
import { PagamentoEntity } from './pagamento.entity';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptPagamento } from './interfaces/opt-pagamento.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';

@Injectable()
export class PagamentoRepo
  extends ARepo<PagamentoEntity, IOptPagamento>
  implements RepoBasic<PagamentoEntity, IOptPagamento>
{
  constructor(
    @InjectRepository(PagamentoEntity)
    repo: Repository<PagamentoEntity>,
  ) {
    super([]);
  }

  async findAllAndCount(
    opt: IOptPagamento,
  ): Promise<[PagamentoEntity[], number]> {
    return [[], 0];
  }

  async findAll(opt: IOptPagamento): Promise<PagamentoEntity[]> {
    return [];
  }

  async findOne(opt: IOptPagamento): Promise<PagamentoEntity | null> {
    return null;
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<PagamentoEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
  ): boolean {
    return true;
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<PagamentoEntity>,
    opt: IOptPagamento,
  ): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<PagamentoEntity>,
    opt: IOptPagamento,
  ): void {}

  protected override buildCustomSelect(opt: IOptPagamento): void {}
}
