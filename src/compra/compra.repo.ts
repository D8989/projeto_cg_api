import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompraEntity } from './compra.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptCompra } from './interfaces/opt-compra.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';

@Injectable()
export class CompraRepo
  extends ARepo<CompraEntity, IOptCompra>
  implements RepoBasic<CompraEntity, IOptCompra>
{
  private lojaAlias: string;
  constructor(
    @InjectRepository(CompraEntity)
    private repo: Repository<CompraEntity>,
  ) {
    super(['l']);
    this.lojaAlias = 'l';
  }

  async findAllAndCount(opt: IOptCompra): Promise<[CompraEntity[], number]> {
    const query = this.repo.createQueryBuilder('c');
    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return await query.getManyAndCount();
  }

  async findAll(opt: IOptCompra): Promise<CompraEntity[]> {
    return [];
  }

  async findOne(opt: IOptCompra): Promise<CompraEntity | null> {
    return null;
  }

  async save(compra: CompraEntity, ent?: EntityManager) {
    const repoEnt = ent?.getRepository(CompraEntity) || this.repo;
    return await repoEnt.save(compra);
  }

  async getNextCodigo(ent?: EntityManager) {
    const repoEnt = ent?.getRepository(CompraEntity) || this.repo;
    return await repoEnt
      .createQueryBuilder('c')
      .select('COALESCE(MAX(c.codigo), 0) + 1', 'nextCodigo')
      .getRawOne()
      .then((resp) => resp.nextCodigo);
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
