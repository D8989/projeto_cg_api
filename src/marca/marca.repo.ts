import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMarcaInput } from './dto/create-marca.input';
import { IUniqMarca } from './interface/uniq-marca.interface';
import { IOptMarca } from './interface/opt-marca.interface';
import { ArrayFunctions } from 'src/common/functions/array-functions.class';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
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
      console.log('TRDP: ', resp);

      return resp;
    });
  }

  async findByExactNome(nome: string) {
    return this.findOne({ nome: { value: nome, typeOperator: 'exact' } });
  }

  async save(marca: MarcaEntity, ent?: EntityManager) {
    const tRepo = ent?.getRepository(MarcaEntity) || this.repo;
    return await tRepo.save(marca);
  }

  private buildWhere(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { ids, nome, nomeUnique, descricao, ignoredId } = opt;
    const alias = qb.alias;
    qb.where('1=1'); // forçar começar com .where

    if (ids && ids.length > 0) {
      qb.andWhere(`${alias}.ids IN (:...ids)`, { ids });
    }

    if (ignoredId) {
      qb.andWhere(`${alias}.id <> :ignoredId`, { ignoredId });
    }

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

  private buildSelect(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {
    const { select, customSelect } = opt;

    if (select && select.length > 0) {
      qb.select(select.map((s) => `${qb.alias}.${s}`));
    }
  }

  private buildJoin(qb: SelectQueryBuilder<MarcaEntity>, opt: IOptMarca) {}
}
