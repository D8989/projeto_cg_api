import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTipoItemBaseInput } from './dto/create-tipo_item_base.input';
import { UpdateTipoItemBaseInput } from './dto/update-tipo_item_base.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import { TipoItemBaseDto } from './dto/tipo-item-base.dto';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';

@Injectable()
export class TipoItemBaseService {
  constructor(
    @InjectRepository(TipoItemBaseEntity)
    private tipoItemBaseRepository: Repository<TipoItemBaseEntity>,
  ) {}

  async create(createTipoItemBaseInput: CreateTipoItemBaseInput) {
    const { nome, descricao } = createTipoItemBaseInput;

    const check = await this.checkDuplicata({ nome, descricao }, 'create');
    if (!check.flag) {
      throw new BadRequestException(check.message);
    }

    return await this.tipoItemBaseRepository.save({
      nome: nome,
      nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
      descricao: descricao || 'n/a',
    });
  }

  async findAll() {
    return await this.tipoItemBaseRepository.find({
      order: {
        nomeUnique: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.tipoItemBaseRepository
      .findOne({
        where: { id },
      })
      .then((resp) => {
        if (!resp) {
          throw new NotFoundException('Tipo item-base não foi encontrado');
        }
        return resp;
      });
  }

  async findByNome(nome: string): Promise<TipoItemBaseEntity | null> {
    return await this.tipoItemBaseRepository
      .createQueryBuilder('tib')
      .select('tib.id')
      .where('UPPER(UNACCENT(tib.nome)) = UPPER(UNACCENT(:nome))')
      .setParameters({ nome })
      .getOne();
  }

  async update(id: number, dto: TipoItemBaseDto) {
    const tipo = await this.findOne(id);
    if (!tipo) {
      throw new NotFoundException('Tipo não encontrado para edição');
    }

    const check = await this.checkDuplicata(dto, 'update', tipo.id);
    if (!check.flag) {
      throw new BadRequestException(check.message);
    }

    tipo.nome = dto.nome;
    tipo.nomeUnique = StringFunctionsClass.toLowerUnaccent(dto.nome);
    tipo.descricao = dto.descricao || 'n/a';

    return await this.tipoItemBaseRepository.save(tipo);
  }

  async hardDelete(id: number): Promise<void> {
    const tipo = await this.findOne(id);
    if (!tipo) {
      throw new BadRequestException('Tipo não encontrado para remoção');
    }

    await this.tipoItemBaseRepository.delete({ id: tipo.id });
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
    const query = this.tipoItemBaseRepository
      .createQueryBuilder('tib')
      .select('tib.id')
      .where('UPPER(UNACCENT(tib.nome)) = UPPER(UNACCENT(:nome))');
    const replacements = {};

    if (type === 'create') {
      if (!nome) {
        return {
          flag: false,
          message: 'Nome não informado para criação do tipo item-base',
        };
      }
      replacements['nome'] = nome;
    } else {
      if (nome) {
        if (nome.length === 0) {
          return {
            flag: false,
            message: 'O nome do tipo não pode ser uma string vazia',
          };
        }
        replacements['nome'] = nome;

        if (id) {
          query.andWhere('tib.id <> :id');
          replacements['id'] = id;
        }
      }
    }

    return await query
      .setParameters(replacements)
      .getOne()
      .then((resp) => {
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
}
