import { BadRequestException, Injectable } from '@nestjs/common';
import { LojaRepo } from './loja.repo';
import { ListLojaOptionsDto } from './dto/list-loja-options.dto';
import { CreateLojaInput } from './dto/create-loja.input';
import { LojaDto } from './dto/loja.dto';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { TipoLojaService } from 'src/tipo-loja/tipo-loja.service';
import { EntityManager } from 'typeorm';
import { LojaEntity } from './loja.entity';
import { EnderecoService } from 'src/endereco/endereco.service';
import { EnderecoDto } from 'src/endereco/dto/endereco.dto';

@Injectable()
export class LojaService {
  constructor(
    private lojaRepo: LojaRepo,
    private tipoLojaService: TipoLojaService,
    private enderecoService: EnderecoService,
  ) {}

  async findPaginado(opt: ListLojaOptionsDto) {
    if (!opt.limite) {
      opt.limite = 100;
    }
    return this.lojaRepo.findAllAndCount(opt.toIOptLoja());
  }

  async findAll(opt: ListLojaOptionsDto) {
    return this.lojaRepo.findAll(opt.toIOptLoja());
  }

  async findByIds(ids: number[]) {
    if (ids.length === 0) {
      return [];
    }
    return this.lojaRepo.findAll({ ids: ids });
  }

  async findById(id: number) {
    return await this.lojaRepo.findOne({ ids: [id] });
  }

  async create(dto: CreateLojaInput, ent?: EntityManager) {
    const { nome, apelido, tipoLojaId, enderecoDto } = dto;

    const lojaValid = await this.checkDuplicada({ nome }, 'create');
    if (!lojaValid.flag) {
      throw new BadRequestException(lojaValid.message);
    }

    const tipoLoja = await this.tipoLojaService.findById(tipoLojaId);
    if (!tipoLoja) {
      throw new BadRequestException(
        'Tipo Loja informada não foi encontrada no sistema para a criação da loja',
      );
    }

    return await this.lojaRepo.save(
      new LojaEntity({
        ...this.enderecoService.getEnderecoDto(enderecoDto),
        nome: nome,
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
        apelido: apelido,
        tipoLoja: tipoLoja,
      }),
    );
  }

  async checkDuplicada(
    lojaUnique: LojaDto,
    type: 'create' | 'update',
    ignoredId?: number,
  ): Promise<RespBollClass> {
    const { nome } = lojaUnique;
    let nomeUnique = '';
    if (type === 'create') {
      if (!nome || nome.length === 0) {
        return {
          flag: false,
          message: 'Nome não informado para a criação da loja',
        };
      }
      nomeUnique = StringFunctionsClass.toLowerUnaccent(nome);
    } else if (type === 'update') {
      if (!nome || nome.length === 0) {
        return { flag: true, message: '' };
      }
      nomeUnique = StringFunctionsClass.toLowerUnaccent(nome);
    }

    if (nomeUnique.length === 0) {
      return { flag: false, message: `Tipo desconhecido "${type}"` };
    }
    const loja = await this.lojaRepo.findOne({
      nomeUnique,
      ignoredId,
    });

    if (loja) {
      return {
        flag: false,
        message: `Loja com o nome "${nome}" já existe no sistema para ${
          type === 'create' ? 'criação' : 'edição'
        }`,
      };
    }

    return { flag: true, message: '' };
  }

  async getEndereco(loja: LojaEntity): Promise<EnderecoDto> {
    return this.enderecoService.getEnderecoDto({
      ...loja,
    });
  }

  async getTipoLoja(loja: LojaEntity) {
    return await this.tipoLojaService.findByLoader(loja.tipoLojaId);
  }
}
