import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoLojaEntity } from './tipo-loja.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptTipoLoja } from './interfaces/opt-tipo-loja.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';

@Injectable()
export class TipoLojaRepo
  extends ARepo<TipoLojaEntity, IOptTipoLoja>
  implements RepoBasic<TipoLojaEntity, IOptTipoLoja>
{
  constructor(
    @InjectRepository(TipoLojaEntity)
    private repo: Repository<TipoLojaEntity>,
  ) {
    super([]);
  }

  async save(tipoLoja: TipoLojaEntity, ent?: EntityManager) {
    const entRepo = ent?.getRepository(TipoLojaEntity) || this.repo;
    return await entRepo.save(tipoLoja);
  }

  async findAllAndCount(
    opt: IOptTipoLoja,
  ): Promise<[TipoLojaEntity[], number]> {
    const query = this.repo.createQueryBuilder('tl');

    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return await query.getManyAndCount();
  }

  async findAll(opt: IOptTipoLoja): Promise<TipoLojaEntity[]> {
    const query = this.repo.createQueryBuilder('tl');

    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getMany();
  }

  async findOne(opt: IOptTipoLoja): Promise<TipoLojaEntity | null> {
    const query = this.repo.createQueryBuilder('tl');

    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getOne();
  }

  protected override buildWhere(
    qb: SelectQueryBuilder<TipoLojaEntity>,
    opt: IOptTipoLoja,
  ): void {
    const { buscaSimples, nome, nomeUnique, ids, ignoredId } = opt;
    const alias = qb.alias;
    qb.where(`${alias}.desativadoEm IS NULL`);
    if (buscaSimples && buscaSimples.length > 0) {
      qb.andWhere(
        new Brackets((qbW) => {
          qbW
            .where(`UNACCENCT(${alias}.nome) ILIKE UNACCENT(:busca)`)
            .orWhere(`UNACCENT(${alias}.descricao) ILIKE UNACCENT(:busca)`);
        }),
      );
    } else {
      if (nome) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'nome', nome);
      }
      if (nomeUnique && nomeUnique.length > 0) {
        qb.andWhere(`${alias}.nomeUnique = :nomeUnique`, { nomeUnique });
      }
      if (ids && ids.length > 0) {
        qb.andWhere(`${alias}.id IN(:...ids)`, { ids });
      }
      if (ignoredId) {
        qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
      }
    }
  }

  protected override buildCustomSelect(opt: IOptTipoLoja): void {}

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<TipoLojaEntity>,
    alias?: string | undefined,
  ): boolean {
    return false;
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<TipoLojaEntity>,
    opt: IOptTipoLoja,
  ): void {
    const alias = qb.alias;
    const { ordenarPor, ordem } = opt;
    switch (ordenarPor) {
      default:
        qb.orderBy(`${alias}.nomeUnique`, ordem || 'ASC');
        break;
    }
  }
}
