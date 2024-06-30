import { InjectRepository } from '@nestjs/typeorm';
import { PagamentoEntity } from './pagamento.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptPagamento } from './interfaces/opt-pagamento.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';

@Injectable()
export class PagamentoRepo
  extends ARepo<PagamentoEntity, IOptPagamento>
  implements RepoBasic<PagamentoEntity, IOptPagamento>
{
  private userAlias: string;
  constructor(
    @InjectRepository(PagamentoEntity)
    private repo: Repository<PagamentoEntity>,
  ) {
    super(['u']);
    this.userAlias = 'u';
  }

  async findAllAndCount(
    opt: IOptPagamento,
  ): Promise<[PagamentoEntity[], number]> {
    return [[], 0];
  }

  async findAll(opt: IOptPagamento): Promise<PagamentoEntity[]> {
    return [];
  }

  async findOne(opt: IOptPagamento): Promise<PagamentoEntity | null> {
    const query = this.repo.createQueryBuilder('p');

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return query.getOne();
  }

  async save(pag: PagamentoEntity, ent?: EntityManager) {
    const entRepo = ent?.getRepository(PagamentoEntity) || this.repo;
    return await entRepo.save(pag);
  }

  async hardDelete(pag: PagamentoEntity, ent?: EntityManager) {
    const entRepo = ent?.getRepository(PagamentoEntity) || this.repo;
    return await entRepo.delete({ id: pag.id });
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<PagamentoEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
  ): boolean {
    switch (alias) {
      case this.userAlias:
        qb.innerJoin(`${qb.alias}.usuario`, this.userAlias);
        return true;

      default:
        return false;
    }
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<PagamentoEntity>,
    opt: IOptPagamento,
  ): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<PagamentoEntity>,
    opt: IOptPagamento,
  ): void {
    const { compraIds, nomeUsuario, nomeUsuarioUnique } = opt;

    qb.where('1=1');
    if (compraIds && compraIds.length > 0) {
      qb.andWhere(`${qb.alias}.compraId IN(:...compraIds)`, { compraIds });
    }
    if (nomeUsuario) {
      RepoFunctions.decomptIColumnStrOpt(
        qb,
        this.userAlias,
        'nome',
        nomeUsuario,
      );
    }
    if (nomeUsuarioUnique && nomeUsuarioUnique.length > 0) {
      qb.andWhere(`${this.userAlias}.nomeUnique = :nomeUsuarioUnique`, {
        nomeUsuarioUnique,
      });
    }
  }

  protected override buildCustomSelect(opt: IOptPagamento): void {}
}
