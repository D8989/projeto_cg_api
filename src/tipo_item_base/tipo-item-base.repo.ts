import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IOptTipoItemBase } from './interface/opt-tipo-item-base.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';

@Injectable()
export class TipoItemBaseRepo {
  constructor(
    @InjectRepository(TipoItemBaseEntity)
    private repo: Repository<TipoItemBaseEntity>,
  ) {}

  async save(tipo: TipoItemBaseEntity, ent?: EntityManager) {
    const tRepo = ent?.getRepository(TipoItemBaseEntity) || this.repo;
    return await tRepo.save(tipo);
  }

  async findMany(opt: IOptTipoItemBase) {
    const query = this.repo.createQueryBuilder('tib');

    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getMany();
  }

  async findOne(opt: IOptTipoItemBase) {
    const query = this.repo.createQueryBuilder('tib');

    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getOne();
  }

  async hardDelete(id: number, ent?: EntityManager) {
    const repo = this.getRepo(ent);
    await repo.delete({ id });
  }

  private getRepo(ent?: EntityManager) {
    return ent?.getRepository(TipoItemBaseEntity) || this.repo;
  }

  private buildWhere(
    qb: SelectQueryBuilder<TipoItemBaseEntity>,
    opt: IOptTipoItemBase,
  ) {
    const { ids, nome, nomeUnique, descricao, ignoredId, buscaSimples } = opt;
    const alias = qb.alias;

    qb.where(`1=1`);

    if (ids && ids.length > 0) {
      qb.andWhere(`${alias}.id IN (:...ids)`, { ids });
    }

    if (ignoredId) {
      qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
    }

    if (buscaSimples) {
      qb.innerJoin(`${alias}.tipoItemBase`, 'tib');
      qb.where(
        new Brackets((qbW) => {
          qbW
            .where(`${alias}.nomeUnique ILIKE UNACCENT(LOWER(:busca))`)
            .orWhere(`tib.nome ILIKE :busca`, {
              busca: `%${buscaSimples}%`,
            });
        }),
      );
    } else {
      if (nomeUnique) {
        qb.andWhere(`${alias}.nomeUnique = :nomeUnique`, { nomeUnique });
      }

      if (nome) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'nome', nome);
      }

      if (descricao) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'descricao', descricao);
      }
    }
  }

  private buildSelect(
    qb: SelectQueryBuilder<TipoItemBaseEntity>,
    opt: IOptTipoItemBase,
  ) {
    const { select, customSelect } = opt;

    if (select && select.length > 0) {
      qb.select(select.map((s) => `${qb.alias}.${s}`));
    }
  }

  private buildPagination(
    qb: SelectQueryBuilder<TipoItemBaseEntity>,
    opt: IOptTipoItemBase,
  ) {
    const { limite, offset } = opt;
    if (limite) {
      qb.limit(limite);
      qb.offset(offset || 0);
    }
  }

  private buildOrder(
    qb: SelectQueryBuilder<TipoItemBaseEntity>,
    opt: IOptTipoItemBase,
  ) {
    const { ordenarPor, ordem } = opt;

    switch (ordenarPor) {
      case 'nome':
        qb.orderBy(`${qb.alias}.nomeUnique`, ordem || 'ASC');
        break;

      default:
        qb.orderBy(`${qb.alias}.nomeUnique`, 'ASC');
        break;
    }
  }
}
