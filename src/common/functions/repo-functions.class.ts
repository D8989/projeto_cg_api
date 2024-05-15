import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { IColumnStrOpt } from '../interfaces/column-string-opt.interface';
import { ObjectFunctions } from './object-functions.class';

export class RepoFunctions {
  static decomptIColumnStrOpt<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    column: string,
    iColumn: IColumnStrOpt,
  ) {
    switch (iColumn.typeOperator) {
      case 'exact':
        qb.andWhere(`${alias}.${column} = :value`, { value: iColumn.value });
        break;

      case 'like':
        qb.andWhere(`${alias}.${column} LIKE :value`, {
          value: `%${iColumn.value}%`,
        });
        break;

      case 'ilike':
        qb.andWhere(
          `UNACCENT(UPPER(${alias}.${column})) ILIKE UNACCENT(UPPER(:value))`,
          { value: `%${iColumn.value}%` },
        );

        break;

      default:
        break;
    }
  }

  static buildSimpleSelect(alias: string, select?: string[]): string[] {
    return select && select.length > 0
      ? select.map((s) => `${alias}.${s}`)
      : [];
  }

  static buildCustomSelect(
    entityAliases: string[],
    customSelect?: MyObject,
  ): string[] {
    if (!customSelect) {
      return [];
    }

    const validAliases = ObjectFunctions.getValidKeys(
      customSelect,
      entityAliases,
    );
    return validAliases.reduce((columns, alias) => {
      return [
        ...columns,
        ...customSelect[alias].map((col) => `${alias}.${col}`),
      ];
    }, []);
  }
}
