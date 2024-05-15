import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseEntity } from './item_base.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IOptItemBase } from './interface/opt-item-base.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Injectable()
export class ItemBaseRepo {
  private readonly tibAlias = 'tib';
  private readonly alias = [this.tibAlias];

  constructor(
    @InjectRepository(ItemBaseEntity)
    private repo: Repository<ItemBaseEntity>,
  ) {}

  async save(item: ItemBaseEntity, ent?: EntityManager) {
    const tRepo = ent?.getRepository(ItemBaseEntity) || this.repo;
    return await tRepo.save(item);
  }

  async findOne(opt: IOptItemBase) {
    const query = this.repo.createQueryBuilder('ib');

    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);

    return await query.getOne().then((resp) => {
      return resp;
    });
  }

  async findMany(opt: IOptItemBase) {
    const query = this.repo.createQueryBuilder('ib');

    this.buildJoin(query, opt);
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getMany();
  }

  async hardDelete(id: number, ent?: EntityManager) {
    const tRepo = ent?.getRepository(ItemBaseEntity) || this.repo;
    await tRepo.delete({ id });
  }

  private buildWhere(
    qb: SelectQueryBuilder<ItemBaseEntity>,
    opt: IOptItemBase,
  ) {
    const {
      ids,
      nome,
      nomeUnique,
      descricao,
      ignoredId,
      buscaSimples,
      tipoItemBaseIds,
    } = opt;
    const alias = qb.alias;

    qb.where(`1=1`);

    if (ids && ids.length > 0) {
      qb.andWhere(`${alias}.id IN (:...ids)`, { ids });
    }

    if (ignoredId) {
      qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
    }

    if (buscaSimples) {
      qb.where(
        new Brackets((qbW) => {
          qbW
            .where(`${alias}.nomeUnique ILIKE UNACCENT(LOWER(:busca))`)
            .orWhere(`${this.tibAlias}.nome ILIKE :busca`, {
              busca: `%${buscaSimples}%`,
            });
        }),
      );
    } else {
      if (nomeUnique) {
        qb.andWhere(`${alias}.nomeUnique = :nomeUnique`, { nomeUnique });
      }

      if (tipoItemBaseIds && tipoItemBaseIds.length > 0) {
        qb.andWhere(`${alias}.tipoItemBaseId IN(:...tibIds)`, {
          tibIds: tipoItemBaseIds,
        });
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
    qb: SelectQueryBuilder<ItemBaseEntity>,
    opt: IOptItemBase,
  ) {
    const { select, customSelect } = opt;

    qb.select([
      ...RepoFunctions.buildSimpleSelect(qb.alias, select),
      ...RepoFunctions.buildCustomSelect(this.alias, customSelect),
    ]);
  }

  private buildPagination(
    qb: SelectQueryBuilder<ItemBaseEntity>,
    opt: IOptItemBase,
  ) {
    const { limite, offset } = opt;
    if (limite) {
      qb.limit(limite);
      qb.offset(offset || 0);
    }
  }

  private buildOrder(
    qb: SelectQueryBuilder<ItemBaseEntity>,
    opt: IOptItemBase,
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

  private buildJoin(qb: SelectQueryBuilder<ItemBaseEntity>, opt: IOptItemBase) {
    const { buscaSimples, customSelect } = opt;
    const joinedAlias: string[] = [];

    if (customSelect) {
      const keys = ObjectFunctions.getValidKeys(customSelect, this.alias);
      for (const key of keys) {
        const alias = this.alias.find((al) => al === key);
        if (alias) {
          const isJoined = this.buildSpecificJoin(qb, alias);
          if (isJoined) {
            joinedAlias.push(alias);
          }
        }
      }
    }

    if (
      !joinedAlias.includes(this.tibAlias) &&
      buscaSimples &&
      buscaSimples.length > 0
    ) {
      qb.innerJoin(`${qb.alias}.tipoItemBase`, this.tibAlias);
    }
  }

  private buildSpecificJoin(
    qb: SelectQueryBuilder<ItemBaseEntity>,
    alias?: string,
  ) {
    switch (alias) {
      case this.tibAlias:
        qb.innerJoin(`${qb.alias}.tipoItemBase`, this.tibAlias);
        break;

      default:
        return false;
    }

    return true;
  }
}
