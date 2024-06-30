import { registerEnumType } from '@nestjs/graphql';

export enum FormaPagamentoEnum {
  DINHEIRO = 'DINHEIRO',
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
}

registerEnumType(FormaPagamentoEnum, {
  name: 'FormaPagamentoEnum',
});
