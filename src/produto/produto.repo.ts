import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { IOptProduto } from './interface/opt-produto.interface';
import { ARepo } from 'src/common/classes/repo.abstract';

@Injectable()
export class ProdutoRepo extends ARepo<ProdutoEntity, IOptProduto> {
  private readonly mAlias: string;
  private readonly ibAlias: string;
  constructor(
    @InjectRepository(ProdutoEntity)
    private produtoRepo: Repository<ProdutoEntity>,
  ) {
    super(['m', 'ib']);
    this.mAlias = 'm';
    this.ibAlias = 'ib';
  }

  async saveMany(produtos: ProdutoEntity[], ent?: EntityManager) {
    const repo = ent?.getRepository(ProdutoEntity) || this.produtoRepo;
    return await repo.save(produtos);
  }

  async saveOne(produto: ProdutoEntity, ent?: EntityManager) {
    return (await this.saveMany([produto]))[0];
  }

  async findAllAndCount(opt: IOptProduto) {
    const query = this.produtoRepo.createQueryBuilder('p');
    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return query.getManyAndCount();
  }

  protected buildWhere(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {}

  protected buildOrder(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {
    const ordem = opt.ordem || 'ASC';
    switch (opt.ordenarPor) {
      case 'nome':
        qb.orderBy(`${qb.alias}.nome`, ordem);
        break;

      default:
        qb.orderBy(`${qb.alias}.nome`, 'ASC');
        break;
    }
  }

  protected buildSpecificJoin(
    qb: SelectQueryBuilder<ProdutoEntity>,
    alias?: string,
  ) {
    switch (alias) {
      case this.mAlias:
        qb.innerJoin(`${qb.alias}.marca`, this.mAlias);
        break;

      case this.ibAlias:
        qb.innerJoin(`${qb.alias}.itemBase`, this.ibAlias);
        break;

      default:
        return false;
    }

    return true;
  }
}
