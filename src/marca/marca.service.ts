import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarcaInput } from './dto/create-marca.input';
import { IUniqMarca } from './interface/uniq-marca.interface';
import { MarcaRepo } from './marca.repo';
import { IOptMarca } from './interface/opt-marca.interface';
import { MarcaEntity } from './marca.entity';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ListMarcaOptionsDto } from './dto/list-marca-options.dto';
import { DeactivateMarcaInput } from './dto/deactivate-marca.input';
import { TypeLoader } from 'src/common/types/loader.type';
import { LoaderFactory } from 'src/common/functions/loader-factory.class';

@Injectable()
export class MarcaService {
  private loader: TypeLoader<MarcaEntity>;
  constructor(private marcaRepo: MarcaRepo) {
    this.loader = LoaderFactory.createLoader((ids: number[]) =>
      this.findByIds(ids),
    );
  }

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

    const qtdProdutos = await this.marcaRepo.getQtdProdutos(marca.id);
    if (!qtdProdutos) {
      throw new BadRequestException(
        'Não foi possível definir se uma marca possui produtos cadastrados ou não',
      );
    }

    if (qtdProdutos > 0) {
      throw new BadRequestException(
        'Não é possível deletar marca que tenha produtos cadastrados',
      );
    }
    const now = new Date();
    marca.desativadoEm = now;
    marca.atualizadoEm = now;

    return await this.marcaRepo.save(marca).then((resp) => {
      this.clearLoaders([resp.id]);
      return resp;
    });
  }

  async fetchMarca(id: number, opt?: IOptMarca) {
    return await this.marcaRepo.findOne({ ...opt, ids: [id] }).then((resp) => {
      if (!resp) {
        throw new NotFoundException('Marca não encontrada para visualização');
      }
      return resp;
    });
  }

  async findMarca(id: number, opt?: IOptMarca) {
    return await this.marcaRepo.findOne({ ...opt, ids: [id] });
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
    if (marcaFound) {
      return true;
    }

    return false;
  }

  async findByIds(ids: number[]): Promise<MarcaEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    return await this.marcaRepo.findMany({
      ids,
    });
  }

  async exits(id: number): Promise<boolean> {
    return await this.marcaRepo
      .findOne({ ids: [id] })
      .then((resp) => (resp ? true : false));
  }

  async findByLoader(id: number) {
    return await this.loader.load(id);
  }

  getMarcaDesconhecida() {
    return new MarcaEntity({
      id: 0,
      nome: 'Desconecido',
    });
  }

  private clearLoaders(ids: number[]) {
    ids.forEach((id) => {
      this.loader.clear(id);
    });
  }
}
