import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptUsuario } from './dto/opt-usuario.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';

@Injectable()
export class UsuarioRepo
  extends ARepo<UsuarioEntity, IOptUsuario>
  implements RepoBasic<UsuarioEntity, IOptUsuario>
{
  constructor(
    @InjectRepository(UsuarioEntity)
    private repo: Repository<UsuarioEntity>,
  ) {
    super([]);
  }

  async findAllAndCount(opt: IOptUsuario): Promise<[UsuarioEntity[], number]> {
    return [[], 0];
  }

  async findAll(opt: IOptUsuario): Promise<UsuarioEntity[]> {
    return [];
  }

  async findOne(opt: IOptUsuario): Promise<UsuarioEntity | null> {
    const query = this.repo.createQueryBuilder('u');

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);

    return await query.getOne();
  }

  async save(user: UsuarioEntity, ent?: EntityManager) {
    const entRepo = ent?.getRepository(UsuarioEntity) || this.repo;
    return await entRepo.save(user);
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<UsuarioEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
  ): boolean {
    return false;
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<UsuarioEntity>,
    opt: IOptUsuario,
  ): void {}

  protected override buildWhere(
    qb: SelectQueryBuilder<UsuarioEntity>,
    opt: IOptUsuario,
  ): void {
    const { nomeUnique } = opt;

    qb.where('1=1');
    if (nomeUnique) {
      qb.andWhere(`${qb.alias}.nomeUnique = :nomeUnique`, { nomeUnique });
    }
  }

  protected override buildCustomSelect(opt: IOptUsuario): void {}
}
