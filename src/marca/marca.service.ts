import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaInput } from './dto/create-marca.input';
import { IUniqMarca } from './interface/uniq-marca.interface';
import { MarcaRepo } from './marca.repo';
import { IOptMarca } from './interface/opt-marca.interface';
import { MarcaEntity } from './marca.entity';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ListMarcaOptionsDto } from './dto/list-marca-options.dto';
import { DeactivateMarcaInput } from './dto/deactivate-marca.input';

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

  async getMarcasPaginada(opt: ListMarcaOptionsDto) {
    if (!opt.limite) {
      opt.limite = 100;
    }
    return await this.marcaRepo.findAllAndCount(opt.toIFindMarca());
  }

  async softDeleteMarca(opt: DeactivateMarcaInput) {
    const { id } = opt;
    const marca = await this.marcaRepo.findOne({
      select: ['id', 'nome'],
      ids: [id],
    });
    if (!marca) {
      throw new NotFoundException('Marca não encontrada para a desaivação');
    }
    const now = new Date();
    marca.desativadoEm = now;
    marca.atualizadoEm = now;

    return await this.marcaRepo.save(marca);
  }

  async getMarca(id: number) {
    return await this.marcaRepo.findOne({ ids: [id] }).then((resp) => {
      if (!resp) {
        throw new NotFoundException('Marca não encontrada para visualização');
      }
      return resp;
    });
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
