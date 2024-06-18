import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { PutLojaDto } from './dto/put-loja.dto';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';
import { ViewLojaDto } from './dto/view-loja.dto';
import { TipoLojaEntity } from 'src/tipo-loja/tipo-loja.entity';
import { IOptLoja } from './interfaces/loja-options.interface';
import { TypeLoader } from 'src/common/types/loader.type';
import { LoaderFactory } from 'src/common/functions/loader-factory.class';

@Injectable()
export class LojaService {
  private loader: TypeLoader<LojaEntity>;
  constructor(
    private lojaRepo: LojaRepo,
    private tipoLojaService: TipoLojaService,
    private enderecoService: EnderecoService,
  ) {
    this.loader = LoaderFactory.createLoader((ids: number[]) =>
      this.findByIds(ids),
    );
  }

  async findPaginado(opt: ListLojaOptionsDto) {
    if (!opt.limite) {
      opt.limite = 100;
    }
    return await this.lojaRepo.findAllAndCount(opt.toIOptLoja());
  }

  async findViewDtoPaginado(opt: ListLojaOptionsDto) {
    opt.withTipoLoja = true;
    const resp = await this.findPaginado(opt);
    return [resp[0].map((r) => this.entityToViewDto(r)), resp[1]] as [
      ViewLojaDto[],
      number,
    ];
  }

  async getViewDto(id: number) {
    const opt = new ListLojaOptionsDto({
      ids: [id],
      withTipoLoja: true,
    });

    return await this.findAll(opt).then((resp) => {
      if (resp.length === 0) {
        throw new NotFoundException('Loja não encontrada para a visualização');
      }

      return this.entityToViewDto(resp[0]);
    });
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

  async findById(id: number, opt?: IOptLoja) {
    return await this.lojaRepo.findOne({
      ...opt,
      ids: [id],
    });
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

  async update(id: number, dto: PutLojaDto, ent?: EntityManager) {
    const updateDto = ObjectFunctions.removeEmptyProperties(dto);
    const isObjEmpty = ObjectFunctions.isObjectEmpty(updateDto);
    if (isObjEmpty) {
      throw new BadRequestException(
        'Nenhum dado foi informado para alterar a loja',
      );
    }

    const loja = await this.lojaRepo.findOne({ ids: [id], withTipoLoja: true });
    if (!loja) {
      throw new BadRequestException(
        'Loja informada não foi encontrada para edição',
      );
    }

    const checkDuplicada = await this.checkDuplicada(
      { nome: updateDto.nome },
      'update',
      loja.id,
    );
    if (!checkDuplicada.flag) {
      throw new BadRequestException(checkDuplicada.message);
    }

    if (this.hasNotAlteracao(loja, dto)) {
      return loja;
    }

    const tipoLoja = dto.tipoLojaId
      ? await this.tipoLojaService.findById(dto.tipoLojaId)
      : loja.tipoLoja;

    if (!tipoLoja) {
      throw new BadRequestException(
        'Tipo Loja informada não encontrada para edição',
      );
    }

    const lojaUpdated = new LojaEntity({
      ...dto.enderecoDto,
      id: loja.id,
      nome: dto.nome || loja.nome,
      nomeUnique: dto.nome
        ? StringFunctionsClass.toLowerUnaccent(dto.nome)
        : loja.nomeUnique,
      apelido: dto.apelido || loja.apelido,
      atualizadoEm: new Date(),
      tipoLojaId: tipoLoja.id,
      tipoLoja: tipoLoja,
    });

    return await this.lojaRepo.save(lojaUpdated).then((resp) => {
      this.clearLoaders([resp.id]);
      return resp;
    });
  }

  async softDelte(id: number, ent?: EntityManager) {
    const loja = await this.lojaRepo.findOne({
      ids: [id],
      select: ['id', 'nome'],
    });
    if (!loja) {
      throw new NotFoundException('Loja não encontrada para desativação');
    }
    loja.desativadoEm = new Date();
    return await this.lojaRepo.save(loja).then((resp) => {
      this.clearLoaders([resp.id]);
      return resp;
    });
  }

  async findByLoader(id: number) {
    return await this.loader.load(id);
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
      select: ['id'],
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

  hasAlteracao(loja: LojaEntity, lojaDto: PutLojaDto) {
    const { nome, enderecoDto, apelido, tipoLojaId } = lojaDto;

    if (
      nome &&
      loja.nomeUnique !== StringFunctionsClass.toLowerUnaccent(nome)
    ) {
      return true;
    }
    if (apelido && loja.apelido !== apelido) {
      return true;
    }
    if (tipoLojaId && loja.tipoLojaId !== tipoLojaId) {
      return true;
    }
    if (
      enderecoDto &&
      this.enderecoService.hasChange(
        this.enderecoService.getEnderecoDto({ ...loja }),
        this.enderecoService.getEnderecoDto(enderecoDto),
      )
    ) {
      return true;
    }

    return false;
  }

  hasNotAlteracao(loja: LojaEntity, lojaDto: PutLojaDto) {
    return !this.hasAlteracao(loja, lojaDto);
  }

  async getEndereco(loja: LojaEntity): Promise<EnderecoDto> {
    return this.enderecoService.getEnderecoDto({
      ...loja,
    });
  }

  getEnderecoSimple(loja: LojaEntity): EnderecoDto {
    return this.enderecoService.getEnderecoDto({
      ...loja,
    });
  }

  async getTipoLoja(loja: LojaEntity) {
    return await this.tipoLojaService.findByLoader(loja.tipoLojaId);
  }

  private entityToViewDto(loja: LojaEntity): ViewLojaDto {
    return new ViewLojaDto({
      id: loja.id,
      nome: loja.nome,
      apelido: loja.apelido,
      tipoLoja: new TipoLojaEntity({
        id: loja.tipoLoja.id,
        nome: loja.tipoLoja.nome,
        descricao: loja.tipoLoja.descricao,
      }),
      enderecoDto: this.getEnderecoSimple(loja),
    });
  }

  private clearLoaders(ids: number[]) {
    for (const id of ids) {
      this.loader.clear(id);
    }
  }
}
