import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCompraEntity } from './item-compra.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptItemCompra } from './interfaces/opt-item-compra.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';

@Injectable()
export class ItemCompraRepo
  extends ARepo<ItemCompraEntity, IOptItemCompra>
  implements RepoBasic<ItemCompraEntity, IOptItemCompra>
{
  constructor(
    @InjectRepository(ItemCompraEntity)
    private repo: Repository<ItemCompraEntity>,
  ) {
    super([]);
  }

  async findAllAndCount(
    opt: IOptItemCompra,
  ): Promise<[ItemCompraEntity[], number]> {
    return [[], 0];
  }

  async findAll(opt: IOptItemCompra): Promise<ItemCompraEntity[]> {
    return [];
  }

  async findOne(opt: IOptItemCompra): Promise<ItemCompraEntity | null> {
    const query = this.repo.createQueryBuilder('ic');

    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);

    return await query.getOne();
  }

  async updateDireto(id: number, item: ItemCompraEntity, ent?: EntityManager) {
    const repoEnt = ent?.getRepository(ItemCompraEntity) || this.repo;
    await repoEnt.update({ id }, item);
  }

  async save(item: ItemCompraEntity, ent?: EntityManager) {
    const repoEnt = ent?.getRepository(ItemCompraEntity) || this.repo;
    return await repoEnt.save(item);
  }

  protected override buildCustomSelect(opt: IOptItemCompra): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<ItemCompraEntity>,
    opt: IOptItemCompra,
  ): void {
    const { compraIds, produtoIds } = opt;

    qb.where('1=1');
    if (produtoIds && produtoIds.length > 0) {
      qb.andWhere(`${qb.alias}.produtoId IN(:...produtoIds)`, { produtoIds });
    }
    if (compraIds && compraIds.length > 0) {
      qb.andWhere(`${qb.alias}.compraId IN(:...compraIds)`, { compraIds });
    }
  }

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
