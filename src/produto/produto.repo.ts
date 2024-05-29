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
import { ArrayFunctions } from 'src/common/functions/array-functions.class';

@Injectable()
export class ProdutoRepo extends ARepo<ProdutoEntity, IOptProduto> {
  private readonly mAlias: string;
  private readonly ibAlias: string;
  private readonly tibAlias: string;
  constructor(
    @InjectRepository(ProdutoEntity)
    private produtoRepo: Repository<ProdutoEntity>,
  ) {
    super(['m', 'ib', 'tib']);
    this.mAlias = 'm';
    this.ibAlias = 'ib';
    this.tibAlias = 'tib';
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

    this.buildCustomSelect(opt);

    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return query.getManyAndCount();
  }

  async findAll(opt: IOptProduto) {
    const query = this.produtoRepo.createQueryBuilder('p');

    this.buildCustomSelect(opt);

    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return query.getMany();
  }

  async findOne(opt: IOptProduto) {
    const query = this.produtoRepo.createQueryBuilder('p');

    this.buildCustomSelect(opt);

    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return query.getOne();
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

      case this.tibAlias:
        qb.innerJoin(`${this.ibAlias}.tipoItemBase`, this.tibAlias);
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
    const {
      buscaSimples,
      customSelect,
      marcaNome,
      itemBaseNome,
      bringMarca,
      bringItemBase,
    } = opt;

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

      if (
        (marcaNome || bringMarca) &&
        !RepoFunctions.hasAlias(qb, this.mAlias)
      ) {
        qb.innerJoin(`${qb.alias}.marca`, this.mAlias);
      }
      if (
        (itemBaseNome || bringItemBase) &&
        !RepoFunctions.hasAlias(qb, this.ibAlias)
      ) {
        qb.innerJoin(`${qb.alias}.itemBase`, this.ibAlias);
      }
    }
  }

  protected override buildSelect(
    qb: SelectQueryBuilder<ProdutoEntity>,
    opt: IOptProduto,
  ) {
    const { select, customSelect } = opt;

    const columns = [
      ...RepoFunctions.buildSimpleSelect(qb.alias, select),
      ...RepoFunctions.buildCustomSelect(this.alias, customSelect),
    ];

    if (columns.length > 0) {
      qb.select(columns);
    }
  }

  protected override buildCustomSelect(opt: IOptProduto): void {
    const { bringMarca, bringItemBase } = opt;
    const joins = {
      marca: false,
      item: false,
      tipoItem: false,
    };
    if (bringMarca || bringItemBase) {
      opt.customSelect = opt.customSelect || {};
      if (bringMarca) {
        joins.marca = true;
      }
      if (bringItemBase) {
        joins.item = true;
        joins.tipoItem = true;
      }

      if (joins.marca) {
        opt.customSelect[this.mAlias] = ArrayFunctions.uniqueArray(
          opt.customSelect[this.mAlias] || [],
          ['id', 'nome', 'descricao'],
        );
      }
      if (joins.item) {
        opt.customSelect[this.ibAlias] = ArrayFunctions.uniqueArray(
          opt.customSelect[this.ibAlias] || [],
          ['id', 'nome', 'descricao'],
        );

        if (joins.tipoItem) {
          opt.customSelect[this.tibAlias] = ArrayFunctions.uniqueArray(
            opt.customSelect[this.tibAlias] || [],
            ['id', 'nome'],
          );
        }
      }
    }
  }
}
