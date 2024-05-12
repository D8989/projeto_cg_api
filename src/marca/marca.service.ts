import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaInput } from './dto/create-marca.input';
import { IUniqMarca } from './interface/uniq-marca.interface';
import { MarcaRepo } from './marca.repo';
import { IOptMarca } from './interface/opt-marca.interface';
import { MarcaEntity } from './marca.entity';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@Injectable()
export class MarcaService {
  constructor(private marcaRepo: MarcaRepo) {}

  async createMarca(dto: CreateMarcaInput) {
    const { nome, descricao } = dto;

    const isDuplicada = await this.isDuplicada({ nome });
    if (isDuplicada) {
      throw new NotFoundException(
        `Marca de nome "${nome}" já existe no sistema`,
      );
    }

    return await this.marcaRepo.save(
      new MarcaEntity({
        nome: nome,
        descricao: descricao,
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
      }),
    );
  }

  private async isDuplicada(
    uniqMarca: IUniqMarca,
    ignoredId?: number,
  ): Promise<boolean> {
    const { nome } = uniqMarca;
    const opt: IOptMarca = {
      select: ['id'],
      nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
    };

    if (ignoredId) {
      opt['ignoredId'] = ignoredId;
    }
    const marcaFound = await this.marcaRepo.findOne(opt);

    console.log('FOUND: ', marcaFound);

    if (marcaFound) {
      return true;
    }

    return false;
  }
}
