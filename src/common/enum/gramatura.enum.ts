import { registerEnumType } from '@nestjs/graphql';

export enum EGramatura {
  KG = 'Kg',
  G = 'g',
  L = 'l',
  ML = 'ml',
  UNID = 'unid',
  PCT = 'pct',
}

registerEnumType(EGramatura, {
  name: 'EGramatura',
  description: 'Siglas das unidades aceitas',
});
