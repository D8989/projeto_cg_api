import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IOptProduto } from './interface/opt-produto.interface';
import { ARepo } from 'src/common/classes/repo.abstract';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

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

  protected override buildWhere(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {
    const { buscaSimples, ids, nome, marcaNome, itemBaseNome } = opt;
    const alias = qb.alias;

    qb.where(`${alias}.desativadoEm IS NULL`);
    if (buscaSimples && buscaSimples.length > 0) {
      qb.andWhere(
        new Brackets((qbW) => {
          qbW
            .where(`UNACCENT(${alias}.nome) ILIKE UNACCENT(:busca)`)
            .orWhere(`UNACCENT(${this.mAlias}.nome) ILIKE UNACCENT(:busca)`)
            .orWhere(`UNACCENT(${this.ibAlias}.nome) ILIKE UNACCENT(:busca)`, {
              busca: `%${buscaSimples}%`,
            });
        }),
      );
    } else {
      if (ids && ids.length > 0) {
        qb.andWhere(`${alias}.id IN(:...ids)`, { ids });
      }
      if (nome) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'nome', nome);
      }
      if (marcaNome) {
        RepoFunctions.decomptIColumnStrOpt(qb, this.mAlias, 'nome', marcaNome);
      }
      if (itemBaseNome) {
        RepoFunctions.decomptIColumnStrOpt(
          qb,
          this.ibAlias,
          'nome',
          itemBaseNome,
        );
      }
    }
  }

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

  protected override buildJoin(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {
    const { buscaSimples, customSelect, marcaNome, itemBaseNome } = opt;

    if (buscaSimples && buscaSimples.length > 0) {
      this.joinAll(qb);
    } else {
      if (customSelect) {
        const keys = ObjectFunctions.getValidKeys(customSelect, this.alias);
        for (const key of keys) {
          const alias = this.alias.find((al) => al === key);
          if (alias && !RepoFunctions.hasAlias(qb, alias)) {
            this.buildSpecificJoin(qb, alias);
          }
        }
      }

      if (marcaNome && !RepoFunctions.hasAlias(qb, this.mAlias)) {
        qb.innerJoin(`${qb.alias}.marca`, this.mAlias);
      }
      if (itemBaseNome && !RepoFunctions.hasAlias(qb, this.ibAlias)) {
        qb.innerJoin(`${qb.alias}.itemBase`, this.ibAlias);
      }
    }
  }
}
