import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { IOptProduto } from './interface/opt-produto.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Injectable()
export class ProdutoRepo {
  private readonly mAlias = 'm';
  private readonly ibAlias = 'ib';
  private readonly alias = [this.mAlias, this.ibAlias];
  constructor(
    @InjectRepository(ProdutoEntity)
    private produtoRepo: Repository<ProdutoEntity>,
  ) {}

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

  private buildJoin(qb: SelectQueryBuilder<ProdutoEntity>, opt: IOptProduto) {
    const { buscaSimples, customSelect } = opt;

    if (buscaSimples && buscaSimples.length > 0) {
      this.joinAll(qb);
    } else if (customSelect) {
      const keys = ObjectFunctions.getValidKeys(customSelect, this.alias);
      for (const key of keys) {
        const alias = this.alias.find((al) => al === key);
        if (alias && !RepoFunctions.hasAlias(qb, alias)) {
          this.buildSpecificJoin(qb, alias);
        }
      }
    }
  }

  private buildSelect(qb: SelectQueryBuilder<ProdutoEntity>, opt: IOptProduto) {
    const { select, customSelect } = opt;
    const columns = [
      ...RepoFunctions.buildSimpleSelect(qb.alias, select),
      ...RepoFunctions.buildCustomSelect(this.alias, customSelect),
    ];

    if (columns.length > 0) {
      qb.select(columns);
    }
  }

  private buildWhere(qb: SelectQueryBuilder<ProdutoEntity>, opt: IOptProduto) {}

  private buildOrder(qb: SelectQueryBuilder<ProdutoEntity>, opt: IOptProduto) {
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

  private buildPagination(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {
    const { limite, offset } = opt;
    if (limite && limite > 0) {
      qb.limit(limite).offset(offset);
    }
  }

  private buildSpecificJoin(
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

  private joinAll(qb: SelectQueryBuilder<ProdutoEntity>) {
    for (const alias of this.alias) {
      if (!RepoFunctions.hasAlias(qb, alias)) {
        this.buildSpecificJoin(qb, alias);
      }
    }
  }
}
