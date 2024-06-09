import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTipoItemBaseInput } from './dto/create-tipo_item_base.input';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import { TipoItemBaseDto } from './dto/tipo-item-base.dto';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { TipoItemBaseRepo } from './tipo-item-base.repo';
import { IOptTipoItemBase } from './interface/opt-tipo-item-base.interface';
import { TypeLoader } from 'src/common/types/loader.type';
import { LoaderFactory } from 'src/common/functions/loader-factory.class';

@Injectable()
export class TipoItemBaseService {
  private loader: TypeLoader<TipoItemBaseEntity>;
  constructor(private tipoItemBaseRepository: TipoItemBaseRepo) {
    this.loader = LoaderFactory.createLoader((ids: number[]) =>
      this.findByIds(ids),
    );
  }

  async create(createTipoItemBaseInput: CreateTipoItemBaseInput) {
    const { nome, descricao } = createTipoItemBaseInput;

    const check = await this.checkDuplicata({ nome, descricao }, 'create');
    if (!check.flag) {
      throw new BadRequestException(check.message);
    }

    return await this.tipoItemBaseRepository.save(
      new TipoItemBaseEntity({
        nome: nome,
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
        descricao: descricao || 'n/a',
      }),
    );
  }

  async findAll(opt?: IOptTipoItemBase) {
    return await this.tipoItemBaseRepository.findMany({
      ...opt,
      ordenarPor: 'nome',
      ordem: 'ASC',
    });
  }

  async findOne(id: number, opt?: IOptTipoItemBase) {
    return await this.tipoItemBaseRepository
      .findOne({
        ...opt,
        ids: [id],
      })
      .then((resp) => {
        if (!resp) {
          throw new NotFoundException('Tipo item-base não foi encontrado');
        }
        return resp;
      });
  }

  async findByNome(nome: string): Promise<TipoItemBaseEntity | null> {
    return await this.tipoItemBaseRepository.findOne({
      nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
    });
  }

  async update(id: number, dto: TipoItemBaseDto) {
    dto = ObjectFunctions.removeEmptyProperties(dto);
    if (ObjectFunctions.isObjectEmpty(dto)) {
      throw new BadRequestException(
        'Não foi informado algum dado para a alteração do tipo item-base',
      );
    }

    const tipo = await this.findOne(id);
    if (!tipo) {
      throw new NotFoundException('Tipo não encontrado para edição');
    }

    const check = await this.checkDuplicata(dto, 'update', tipo.id);
    if (!check.flag) {
      throw new BadRequestException(check.message);
    }

    if (dto.nome) {
      tipo.nome = dto.nome;
      tipo.nomeUnique = StringFunctionsClass.toLowerUnaccent(dto.nome);
    }
    tipo.descricao = dto.descricao || 'n/a';

    return await this.tipoItemBaseRepository.save(tipo).then((resp) => {
      this.clearLoaders([resp.id]);
      return resp;
    });
  }

  async hardDelete(id: number): Promise<void> {
    const tipo = await this.findOne(id);
    if (!tipo) {
      throw new BadRequestException('Tipo não encontrado para remoção');
    }

    await this.tipoItemBaseRepository.hardDelete(tipo.id);
    this.clearLoaders([tipo.id]);
  }

  async checkDuplicata(
    dto: TipoItemBaseDto,
    type: 'create' | 'update',
    id?: number,
  ): Promise<{
    flag: boolean;
    message: string;
  }> {
    const { nome } = dto;
    const opt: IOptTipoItemBase = {};

    if (type === 'create') {
      if (!nome) {
        return {
          flag: false,
          message: 'Nome não informado para criação do tipo item-base',
        };
      }
      opt.nomeUnique = StringFunctionsClass.toLowerUnaccent(nome);
    } else if (type === 'update') {
      if (!nome) {
        return { flag: true, message: `nome não será alterado` };
      }

      if (nome.length === 0) {
        return {
          flag: false,
          message: 'O nome do tipo não pode ser uma string vazia',
        };
      }
      opt.nomeUnique = StringFunctionsClass.toLowerUnaccent(nome);

      if (id) {
        opt.ignoredId = id;
      }
    } else {
      throw new BadRequestException(`Tipo "${type}" desconhecido`);
    }

    return await this.tipoItemBaseRepository.findOne(opt).then((resp) => {
      return resp
        ? {
            flag: false,
            message: `O nome do tipo item-base "${nome}" já existe no sistema`,
          }
        : {
            flag: true,
            message: `Nome "${nome}" pode ser utilizado(${type})`,
          };
    });
  }

  async exist(id: number): Promise<RespBollClass> {
    return await this.tipoItemBaseRepository
      .findOne({
        select: ['id', 'nome'],
        ids: [id],
      })
      .then(
        (resp) =>
          new RespBollClass(
            resp
              ? { flag: true, message: `Tipo "${resp.nome}" existe` }
              : { flag: false, message: `Tipo do item não existe` },
          ),
      );
  }

  async findByIds(ids: number[]): Promise<TipoItemBaseEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    return await this.tipoItemBaseRepository.findMany({
      ids,
    });
  }

  async findByLoader(id: number) {
    return this.loader.load(id);
  }

  async getTipoDesconhecido() {
    return new TipoItemBaseEntity({
      id: 0,
      nome: 'Desconhecido',
      descricao: '-',
      nomeUnique: 'desconhecido',
    });
  }

  private clearLoaders(ids: number[]) {
    for (const id of ids) {
      this.loader.clear(id);
    }
  }
}
