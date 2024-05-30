import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IOptMarca } from './interface/opt-marca.interface';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';

// Arquivo na verdade funciona como um service que faz as chamadas mais simples para o BD
@Injectable()
export class MarcaRepo {
  constructor(
    @InjectRepository(MarcaEntity)
    private repo: Repository<MarcaEntity>,
  ) {}

  async findOne(opt: IOptMarca) {
    const query = this.repo.createQueryBuilder('m');
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);

    return await query.getOne().then((resp) => {
      return resp;
    });
  }

  async findMany(opt: IOptMarca) {
    const query = this.repo.createQueryBuilder('m');
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return query.getMany();
  }

  async findAllAndCount(opt: IOptMarca) {
    const query = this.repo.createQueryBuilder('m');
    this.buildSelect(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return await query.getManyAndCount();
  }

  async findByExactNome(nome: string) {
    return this.findOne({ nome: { value: nome, typeOperator: 'exact' } });
  }

  async save(marca: MarcaEntity, ent?: EntityManager) {
    const tRepo = ent?.getRepository(MarcaEntity) || this.repo;
    return await tRepo.save(marca);
  }

  async getQtdProdutos(marcaId: number): Promise<number | undefined> {
    return await this.repo
      .createQueryBuilder('m')
      .select('COUNT(DISTINCT p.id)', 'count')
      .leftJoin('m.produtos', 'p', 'p.desativadoEm IS NULL')
      .where('m.id = :id', { id: marcaId })
      .groupBy('m.id')
      .getRawOne();
  }

  private buildWhere(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { ids, nome, nomeUnique, descricao, ignoredId, buscaSimples } = opt;
    const alias = qb.alias;
    qb.where(`${alias}.desativadoEm IS NULL`);

    if (ids && ids.length > 0) {
      qb.andWhere(`${alias}.id IN (:...ids)`, { ids });
    }

    if (ignoredId) {
      qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
    }

    if (buscaSimples) {
      qb.andWhere(
        new Brackets((qbW) => {
          qbW
            .where(`${alias}.nomeUnique ILIKE UNACCENT(LOWER(:busca))`)
            .orWhere(`${alias}.descricao ILIKE :busca`, {
              busca: `%${buscaSimples}%`,
            });
        }),
      );
    } else {
      if (nomeUnique) {
        qb.andWhere(`${alias}.nomeUnique = :nomeUnique`, { nomeUnique });
      }

      if (nome) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'nome', nome);
      }

      if (descricao) {
        RepoFunctions.decomptIColumnStrOpt(qb, alias, 'descricao', descricao);
      }
    }
  }

  private buildSelect(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { select, customSelect } = opt;

    if (select && select.length > 0) {
      qb.select(select.map((s) => `${qb.alias}.${s}`));
    }
  }

  private buildPagination(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { limite, offset } = opt;
    if (limite) {
      qb.limit(limite);
      qb.offset(offset || 0);
    }
  }

  private buildOrder(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { ordenarPor, ordem } = opt;

    switch (ordenarPor) {
      case 'nome':
        qb.orderBy(`${qb.alias}.nomeUnique`, ordem || 'ASC');
        break;

      default:
        qb.orderBy(`${qb.alias}.nomeUnique`, 'ASC');
        break;
    }
  }

  private buildJoin(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {}
}
