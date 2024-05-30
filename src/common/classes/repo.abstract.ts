import { LiteralObject } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { IFindOpt } from '../interfaces/find-opt.interface';
import { RepoFunctions } from '../functions/repo-functions.class';
import { ObjectFunctions } from '../functions/object-functions.class';

export abstract class ARepo<T extends LiteralObject, U extends IFindOpt> {
  protected alias: string[];
  constructor(aliases: string[]) {
    this.alias = aliases;
  }

  protected buildJoin(qb: SelectQueryBuilder<T>, opt: U) {
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

  protected joinAll(qb: SelectQueryBuilder<T>) {
    for (const alias of this.alias) {
      if (!RepoFunctions.hasAlias(qb, alias)) {
        this.buildSpecificJoin(qb, alias);
      }
    }
  }

  protected buildSelect(qb: SelectQueryBuilder<T>, opt: U) {
    const { select, customSelect } = opt;
    const columns = [
      ...RepoFunctions.buildSimpleSelect(qb.alias, select),
      ...RepoFunctions.buildCustomSelect(this.alias, customSelect),
    ];

    if (columns.length > 0) {
      qb.select(columns);
    }
  }

  protected buildPagination(qb: SelectQueryBuilder<T>, opt: U) {
    const { limite, offset } = opt;
    if (limite && limite > 0) {
      qb.limit(limite).offset(offset);
    }
  }

  protected abstract buildSpecificJoin(
    qb: SelectQueryBuilder<T>,
    alias?: string,
  ): boolean;
  protected abstract buildOrder(qb: SelectQueryBuilder<T>, opt: U): void;
  protected abstract buildWhere(qb: SelectQueryBuilder<T>, opt: U): void;
  protected abstract buildCustomSelect(opt: U): void;
}
