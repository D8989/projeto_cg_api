import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { ItemBaseEntity } from './item_base.entity';
import { TipoItemBaseService } from 'src/tipo_item_base/tipo_item_base.service';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ItemBaseDto } from './dto/item-base.dto';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { ListItemBaseOptionsInput } from './dto/list-item-base-options.input';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';
import { ItemBaseRepo } from './item-base.repo';
import { IOptItemBase } from './interface/opt-item-base.interface';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';
import { TypeLoader } from 'src/common/types/loader.type';
import { LoaderFactory } from 'src/common/functions/loader-factory.class';

@Injectable()
export class ItemBaseService {
  private loader: TypeLoader<ItemBaseEntity>;
  constructor(
    private itemBaseRepo: ItemBaseRepo,
    private tipoItemBaseService: TipoItemBaseService,
  ) {
    this.loader = LoaderFactory.createLoader((ids: number[]) =>
      this.findByIds(ids),
    );
  }

  async create(createItemBaseInput: CreateItemBaseInput) {
    const { tipoItemBaseId, nome, descricao } = createItemBaseInput;

    await Promise.all([
      this.checkDuplicada(createItemBaseInput, 'create'),
      this.tipoItemBaseService.exist(tipoItemBaseId),
    ]).then((resps) => {
      for (const resp of resps) {
        if (!resp.flag) {
          throw new BadRequestException(resp.message);
        }
      }
    });

    const item = new ItemBaseEntity({
      nome,
      descricao: descricao || 'n/a',
      nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
      tipoItemBaseId: tipoItemBaseId,
    });

    return await this.itemBaseRepo.save(item);
  }

  async findAll(opt: ListItemBaseOptionsInput) {
    opt.limite = undefined;
    opt.offset = undefined;
    return this.itemBaseRepo.findMany(opt.toIItemBase());
  }

  async findOne(id: number, opt?: IOptItemBase) {
    return await this.itemBaseRepo.findOne({
      ...opt,
      ids: [id],
    });
  }

  async fetchOne(id: number, opt?: IOptItemBase) {
    return await this.itemBaseRepo
      .findOne({
        ...opt,
        ids: [id],
      })
      .then((resp) => {
        if (!resp) {
          throw new NotFoundException('Item-base não encontrado');
        }
        return resp;
      });
  }

  async update(id: number, dto: ItemBaseDto) {
    const item = await this.findOne(id);
    if (!item) {
      throw new BadRequestException('Item não encontarado para remoção');
    }

    const itemDto = ObjectFunctions.removeEmptyProperties(dto);
    if (ObjectFunctions.isObjectEmpty(itemDto)) {
      throw new BadRequestException('Não foi informado dados para alteração');
    }

    await Promise.all([
      this.checkDuplicada(dto, 'update', item.id),
      itemDto.tipoItemBaseId
        ? this.tipoItemBaseService.exist(itemDto.tipoItemBaseId)
        : { flag: true, message: '' },
    ]).then((resps) => {
      for (const resp of resps) {
        if (!resp.flag) {
          throw new BadRequestException(resp.message);
        }
      }
    });

    if (dto.nome) {
      item.nome = dto.nome;
      item.nomeUnique = StringFunctionsClass.toLowerUnaccent(dto.nome);
    }
    if (dto.tipoItemBaseId) {
      item.tipoItemBaseId = dto.tipoItemBaseId;
    }
    item.descricao = dto.descricao || 'n/a';

    await this.itemBaseRepo.save(item);
    this.clearLoaders([item.id]);

    return item;
  }

  async remove(id: number, hard = false) {
    const item = await this.findOne(id);
    if (!item) {
      throw new BadRequestException('item-base não encontrado para remoção');
    }

    const qtdProdutos = await this.itemBaseRepo.getQtdProdutos(item.id);
    if (!qtdProdutos) {
      throw new BadRequestException(
        'Não possível definir se o item tem produtos cadastrados',
      );
    }

    if (qtdProdutos > 0) {
      throw new BadRequestException(
        'Não é possível desativar item-base com produto cadastrado',
      );
    }

    if (hard) {
      await this.itemBaseRepo.hardDelete(id);
    } else {
      await this.itemBaseRepo.softDelete(id, new Date());
    }

    this.clearLoaders([id]);
    return item;
  }

  async checkDuplicada(
    dto: ItemBaseDto,
    type: 'create' | 'update',
    ignoredId?: number,
  ): Promise<RespBollClass> {
    const { nome } = dto;
    const opt: IOptItemBase = {
      select: ['id'],
    };

    if (type === 'create') {
      if (!nome) {
        return { flag: false, message: 'Nome do item-base não informado' };
      }
    } else if (type === 'update') {
      if (!nome) {
        return { flag: true, message: 'Não alterará o campo único' };
      }
      if (!ignoredId) {
        return {
          flag: false,
          message: 'Id do item editado não informado para validar duplicada',
        };
      }

      opt.ignoredId = ignoredId;
    } else {
      return { flag: false, message: `Tipo ${type} desconhecido` };
    }

    opt.nomeUnique = StringFunctionsClass.toLowerUnaccent(nome);
    const itemFound = await this.itemBaseRepo.findOne(opt);

    return itemFound
      ? {
          flag: false,
          message: `Já existe um item-base com o nome "${nome}" no sistema`,
        }
      : {
          flag: true,
          message: `Nome "${nome}" pode ser usado`,
        };
  }

  async findByIds(ids: number[]): Promise<ItemBaseEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    return await this.itemBaseRepo.findMany({
      ids: ids,
    });
  }

  async exits(id: number): Promise<boolean> {
    return await this.itemBaseRepo
      .findOne({ ids: [id] })
      .then((resp) => (resp ? true : false));
  }

  async getTipo(item: ItemBaseEntity): Promise<TipoItemBaseEntity> {
    return await this.tipoItemBaseService.findOne(item.tipoItemBaseId);
  }

  async findByLoader(id: number) {
    return await this.loader.load(id);
  }

  async getTipoByLoader(item: ItemBaseEntity | number) {
    const id = typeof item === 'number' ? item : item.tipoItemBaseId;
    return await this.tipoItemBaseService.findByLoader(id).then((tipo) => {
      if (!tipo) {
        return this.tipoItemBaseService.getTipoDesconhecido();
      }
      return tipo;
    });
  }

  getItemDesconhecido() {
    return new ItemBaseEntity({
      id: 0,
      nome: 'Desconhedido',
    });
  }

  private clearLoaders(ids: number[]) {
    for (const id of ids) {
      this.loader.clear(id);
    }
  }
}
