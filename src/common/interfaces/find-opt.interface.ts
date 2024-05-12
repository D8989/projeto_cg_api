/**
 * Interface para as opções de busca ao BD que são comuns às entidades para retornar várias
 */
export interface IFindOpt {
  select?: string[];
  customSelect?: string[];
  ids?: number[];
  ignoredId?: number;
  limite?: number;
  offset?: number;
  ordenarPor?: string;
  ordem?: 'ASC' | 'DESC';
  buscaSimples?: string;
}
