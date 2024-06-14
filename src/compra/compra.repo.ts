import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompraEntity } from './compra.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptCompra } from './interfaces/opt-compra.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';

@Injectable()
export class CompraRepo
  extends ARepo<CompraEntity, IOptCompra>
  implements RepoBasic<CompraEntity, IOptCompra>
{
  constructor(
    @InjectRepository(CompraEntity)
    repo: Repository<CompraEntity>,
  ) {
    super([]);
  }

  async findAllAndCount(opt: IOptCompra): Promise<[CompraEntity[], number]> {
    return [[], 0] as [CompraEntity[], number];
  }

  async findAll(opt: IOptCompra): Promise<CompraEntity[]> {
    return [];
  }

  async findOne(opt: IOptCompra): Promise<CompraEntity | null> {
    return null;
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<CompraEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
  ): boolean {
    return false;
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<CompraEntity>,
    opt: IOptCompra,
  ): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<CompraEntity>,
    opt: IOptCompra,
  ): void {}

  protected override buildCustomSelect(opt: IOptCompra): void {}
}
