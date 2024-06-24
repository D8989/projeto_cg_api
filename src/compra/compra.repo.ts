import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompraEntity } from './compra.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ARepo } from 'src/common/classes/repo.abstract';
import { IOptCompra } from './interfaces/opt-compra.interface';
import { RepoBasic } from 'src/common/interfaces/repo-basic.interface';
import { CompraMask } from './dto/compra.mask';
import { ItemCompraEntity } from 'src/item-compra/item-compra.entity';
import { RepoFunctions } from 'src/common/functions/repo-functions.class';
import { ViewListCompraDto } from './dto/view-list-compra.dto';

@Injectable()
export class CompraRepo
  extends ARepo<CompraEntity, IOptCompra>
  implements RepoBasic<CompraEntity, IOptCompra>
{
  private lojaAlias: string;
  private itemAlias: string;
  constructor(
    @InjectRepository(CompraEntity)
    private repo: Repository<CompraEntity>,
  ) {
    super(['l', 'i']);
    this.lojaAlias = 'l';
    this.itemAlias = 'i';
  }

  async findAllAndCount(opt: IOptCompra): Promise<[CompraEntity[], number]> {
    const query = this.repo.createQueryBuilder('c');
    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    return await query.getManyAndCount();
  }

  async findAll(opt: IOptCompra): Promise<CompraEntity[]> {
    const query = this.repo.createQueryBuilder('c');
    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getMany();
  }

  async findOne(opt: IOptCompra): Promise<CompraEntity | null> {
    const query = this.repo.createQueryBuilder('c');
    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);

    return await query.getOne();
  }

  async save(compra: CompraEntity, ent?: EntityManager) {
    const repoEnt = ent?.getRepository(CompraEntity) || this.repo;
    return await repoEnt.save(compra);
  }

  async getNextCodigo(ent?: EntityManager) {
    const repoEnt = ent?.getRepository(CompraEntity) || this.repo;
    return await repoEnt
      .createQueryBuilder('c')
      .select('COALESCE(MAX(c.codigo), 0) + 1', 'nextCodigo')
      .getRawOne()
      .then((resp) => resp.nextCodigo);
  }

  async update(id: number, compraPropertys: CompraMask, ent: EntityManager) {
    const repoEnt = ent?.getRepository(CompraEntity) || this.repo;
    await repoEnt.update({ id }, { ...compraPropertys });
  }

  async findAllAndCountWithValor(
    opt: IOptCompra,
  ): Promise<[CompraEntity[], number]> {
    const query = this.repo.createQueryBuilder('c');
    const queryCount = this.repo.createQueryBuilder('c_count');

    if (opt.selectValorTotal) {
      this.selectValorTotal(query);
    }

    this.buildCustomSelect(opt);

    this.buildSelect(query, opt);
    this.buildJoin(query, opt);
    this.buildWhere(query, opt);
    this.buildOrder(query, opt);
    this.buildPagination(query, opt);

    this.buildWhere(queryCount, opt);
    this.buildJoin(queryCount, opt);

    const dados = await query.getRawAndEntities().then((resp) => {
      const rawColumns = resp.raw;
      resp.entities.forEach((ent, i, self) => {
        self[i].valorTotal = rawColumns.find(
          (c) => c.c_id === ent.id,
        ).valorTotal;
      });

      return resp.entities;
    });
    const total = await queryCount.getCount();

    return [dados, total];
  }

  protected override buildSpecificJoin(
    qb: SelectQueryBuilder<CompraEntity>,
    alias?: string | undefined,
    isInner?: boolean | undefined,
    obj?: MyObjJoin,
  ): boolean {
    switch (alias) {
      case this.lojaAlias:
        qb.innerJoin(`${qb.alias}.loja`, this.lojaAlias);
        return true;

      case this.itemAlias:
        if (isInner) {
          qb.innerJoin(
            `${qb.alias}.itens`,
            this.itemAlias,
            obj?.query,
            obj?.parameters,
          );
        } else {
          qb.leftJoin(
            `${qb.alias}.itens`,
            this.itemAlias,
            obj?.query,
            obj?.parameters,
          );
        }
        return true;

      default:
        return false;
    }
  }

  protected override buildOrder(
    qb: SelectQueryBuilder<CompraEntity>,
    opt: IOptCompra,
  ): void {
    const { ordenarPor, ordem } = opt;

    switch (ordenarPor) {
      case 'valorTotal':
        qb.orderBy(`ic_valor.valor_total`, ordem || 'ASC');
        break;

      default:
        qb.orderBy(`${qb.alias}.dataCompra`, 'DESC');
        break;
    }
  }

  protected override buildWhere(
    qb: SelectQueryBuilder<CompraEntity>,
    opt: IOptCompra,
  ): void {
    const { ids, ignoredId, itemProdutoIds, lojaNome } = opt;
    const alias = qb.alias;
    qb.where(`${alias}.desativadoEm IS NULL`);

    if (ids && ids.length > 0) {
      qb.andWhere(`${alias}.id IN(:...ids)`, { ids });
    }
    if (ignoredId) {
      qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
    }
    if (itemProdutoIds && itemProdutoIds.length > 0) {
      qb.andWhere(`${this.itemAlias}.produtoId IN(:...itemProdutoIds)`, {
        itemProdutoIds,
      });
    }
    if (lojaNome) {
      RepoFunctions.decomptIColumnStrOpt(qb, this.lojaAlias, 'nome', lojaNome);
    }
  }

  private selectValorTotal(qb: SelectQueryBuilder<CompraEntity>) {
    qb.leftJoin(
      qb
        .subQuery()
        .from(ItemCompraEntity, this.itemAlias)
        .select(`${this.itemAlias}.compraId`, 'compra_id')
        .addSelect(
          `SUM((${this.itemAlias}.quantidade * ${this.itemAlias}.custo))::NUMERIC(6,2)`,
          'valor_total',
        )
        .groupBy(`${this.itemAlias}.compraId`)
        .getQuery(),
      'ic_valor',
      `ic_valor.compra_id = c.id`,
    ).addSelect(
      'COALESCE(ic_valor.valor_total,0)::DOUBLE PRECISION',
      'valorTotal',
    );
  }

  protected override buildCustomSelect(opt: IOptCompra): void {}
}
