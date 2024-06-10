import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoLojaRepo } from './tipo-loja.repo';
import { ListTipoLojaOptionsDto } from './dto/list-tipo-loja-options.dto';
import { CreateTipoLojaInput } from './dto/create-tipo-loja.input';
import { TipoLojaDto } from './dto/tipo-loja.dto';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { IOptTipoLoja } from './interfaces/opt-tipo-loja.interface';
import { TipoLojaEntity } from './tipo-loja.entity';
import { EntityManager } from 'typeorm';
import { PutTipoLojaInput } from './dto/put-tipo-loja.input';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Injectable()
export class TipoLojaService {
  constructor(private tipoLojaRepo: TipoLojaRepo) {}

  async findPaginado(opt: ListTipoLojaOptionsDto) {
    if (!opt.limite) {
      opt.limite = 100;
    }
    opt.withBasicSelect = true;
    return this.tipoLojaRepo.findAllAndCount(opt.toIFindTipoLoja());
  }

  async findAll(opt: ListTipoLojaOptionsDto) {
    return this.tipoLojaRepo.findAll(opt.toIFindTipoLoja());
  }

  async findByIds(ids: number[]) {
    if (ids.length === 0) {
      return [];
    }
    return this.tipoLojaRepo.findAll({ ids: ids });
  }

  async findById(id: number) {
    return await this.tipoLojaRepo.findOne({ ids: [id] });
  }

  async visualizarTipo(id: number) {
    return await this.findById(id).then((tipo) => {
      if (!tipo) {
        throw new NotFoundException('Tipo não encontrado');
      }
      return tipo;
    });
  }

  async create(input: CreateTipoLojaInput, ent?: EntityManager) {
    const { nome, descricao } = input;

    const tipoValid = await this.checkDuplicada({ nome: nome }, 'create');
    if (!tipoValid.flag) {
      throw new BadRequestException(tipoValid.message);
    }

    return await this.tipoLojaRepo.save(
      new TipoLojaEntity({
        nome: nome,
        descricao: descricao || 'n/a',
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
      }),
      ent,
    );
  }

  async update(id: number, dto: PutTipoLojaInput, ent?: EntityManager) {
    if (ObjectFunctions.isObjectEmpty(dto)) {
      throw new BadRequestException(
        'Nenhum dado foi informado para a edição do tipo-loja',
      );
    }

    const tipo = await this.tipoLojaRepo.findOne({
      ids: [id],
    });
    if (!tipo) {
      throw new NotFoundException(
        'Tipo-loja informado não encontrado para a edição',
      );
    }

    const tipoDuplicado = await this.checkDuplicada(
      { nome: dto.nome },
      'update',
      tipo.id,
    );
    if (!tipoDuplicado.flag) {
      throw new BadRequestException(tipoDuplicado.message);
    }

    if (dto.nome) {
      tipo.nome = dto.nome;
      tipo.nomeUnique = StringFunctionsClass.toLowerUnaccent(dto.nome);
    }
    tipo.descricao = dto.descricao || 'n/a';
    tipo.atualizadoEm = new Date();

    return await this.tipoLojaRepo.save(tipo, ent);
  }

  async checkDuplicada(
    dto: TipoLojaDto,
    type: 'create' | 'update',
    ignoredId?: number,
  ): Promise<RespBollClass> {
    const { nome } = dto;
    if (type === 'create') {
      if (!nome) {
        return {
          flag: false,
          message: 'Nome não informado para a criação do tipo da loja',
        };
      }
      const tipoFound = await this.tipoLojaRepo.findOne({
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
        select: ['id'],
      });
      if (tipoFound) {
        return {
          flag: false,
          message: `Já existe um tipo-loja com o nome "${nome}" no sistema para criação`,
        };
      }
    }

    if (type === 'update' && nome) {
      const tipoFound = await this.tipoLojaRepo.findOne({
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
        ignoredId: ignoredId,
        select: ['id'],
      });
      if (tipoFound) {
        return {
          flag: false,
          message: `Já existe um tipo-loja com o nome "${nome}" no sistema para edição`,
        };
      }
    }

    return { flag: true, message: '' };
  }
}
