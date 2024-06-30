import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LojaEntity } from './loja.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptLoja } from './interfaces/loja-options.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';
import { TipoLojaEntity } from 'src/tipo-loja/tipo-loja.entity';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';

@Injectable()
export class LojaRepo
  extends ARepo<LojaEntity, IOptLoja>
  implements RepoBasic<LojaEntity, IOptLoja>
{
  private tipoLojaAls: string;
  constructor(
    @InjectRepository(LojaEntity)
    private repo: Repository<LojaEntity>,
  ) {
    super(['tl']);
    this.tipoLojaAls = 'tl';
  }

  async findAllAndCount(opt: IOptLoja): Promise<[LojaEntity[], number]> {
    const query = this.repo.createQueryBuilder('l');

    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return await query.getManyAndCount();
  }

  async findAll(opt: IOptLoja): Promise<LojaEntity[]> {
    const query = this.repo.createQueryBuilder('l');

    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getMany();
  }

  async findOne(opt: IOptLoja): Promise<LojaEntity | null> {
    const query = this.repo.createQueryBuilder('l');

    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getOne();
  }

  async save(loja: LojaEntity, ent?: EntityManager) {
    const entRepo = ent?.getRepository(LojaEntity) || this.repo;
    return await entRepo.save(loja);
  }

  protected override buildWhere(
    qb: SelectQueryBuilder<LojaEntity>,
    opt: IOptLoja,
  ): void {
    const { buscaSimples, ids, ignoredId, nome, nomeUnique } = opt;
    const alias = qb.alias;
    qb.where(`${alias}.desativadoEm IS NULL`);

    if (buscaSimples && buscaSimples.length > 0) {
      qb.where(
        new Brackets((qbW) => {
          qbW
            .where(`UNACCENT(${alias}.nome) ILIKE UNACCENT(:busca)`)
            .orWhere(
              `UNACCENT(${this.tipoLojaAls}.nome) ILIKE UNACCENT(:busca)`,
            );
        }),
      );
    } else {
      if (ids && ids.length > 0) {
        qb.andWhere(`${alias}.id IN(:...ids)`, { ids });
      }
      if (ignoredId) {
        qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
      }
      if (nome) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'nome', nome);
      }
      if (nomeUnique) {
        qb.andWhere(`${alias}.nomeUnique = :nomeUnique`, { nomeUnique });
      }
    }
  }

  protected override buildCustomSelect(opt: IOptLoja): void {
    const { withTipoLoja } = opt;
    const joins = {
      tipoLoja: false,
    };

    if (withTipoLoja) {
      opt.customSelect = opt.customSelect || {};
      joins.tipoLoja = true;
    }

    if (joins.tipoLoja) {
      opt.customSelect = { tl: { colums: ['id', 'nome', 'descricao'] } };
    }
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<LojaEntity>,
    opt: IOptLoja,
  ): void {
    const { ordenarPor, ordem } = opt;
    const alias = qb.alias;
    switch (ordenarPor) {
      case 'tipoLojaNome':
        qb.orderBy(`${this.tipoLojaAls}.nome`, ordem || 'ASC');
        break;
      case 'nome':
        qb.orderBy(`${alias}.nome`, ordem || 'ASC');
        break;
      default:
        qb.orderBy(`${alias}.nome`, 'ASC');
        break;
    }
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<LojaEntity>,
    alias?: string | undefined,
  ): boolean {
    switch (alias) {
      case this.tipoLojaAls:
        qb.innerJoin(`${qb.alias}.tipoLoja`, this.tipoLojaAls);
        return true;

      default:
        return false;
    }
  }
}
