import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCompraEntity } from './item-compra.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptItemCompra } from './interfaces/opt-item-compra.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';
import { ItemBaseEntity } from 'src/item_base/item_base.entity';

@Injectable()
export class ItemCompraRepo
  extends ARepo<ItemCompraEntity, IOptItemCompra>
  implements RepoBasic<ItemBaseEntity, IOptItemCompra>
{
  constructor(
    @InjectRepository(ItemCompraEntity)
    private repo: Repository<ItemCompraEntity>,
  ) {
    super([]);
  }

  async findAllAndCount(
    opt: IOptItemCompra,
  ): Promise<[ItemBaseEntity[], number]> {
    return [[], 0];
  }

  async findAll(opt: IOptItemCompra): Promise<ItemBaseEntity[]> {
    return [];
  }

  async findOne(opt: IOptItemCompra): Promise<ItemBaseEntity | null> {
    return null;
  }

  protected override buildCustomSelect(opt: IOptItemCompra): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<ItemCompraEntity>,
    opt: IOptItemCompra,
  ): void {}

  protected override buildOrder(
    qb: SelectQueryBuilder<ItemCompraEntity>,
    opt: IOptItemCompra,
  ): void {}

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<ItemCompraEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
  ): boolean {
    return true;
  }
}
