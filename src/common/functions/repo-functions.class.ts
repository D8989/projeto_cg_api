import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { IColumnStrOpt } from '../interfaces/column-string-opt.interface';

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
}
