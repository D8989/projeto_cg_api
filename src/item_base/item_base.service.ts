import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { UpdateItemBaseInput } from './dto/update-item_base.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseEntity } from './item_base.entity';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { TipoItemBaseService } from 'src/tipo_item_base/tipo_item_base.service';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ItemBaseDto } from './dto/item-base.dto';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { ListItemBaseOptionsInput } from './dto/list-item-base-options.input';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

@Injectable()
export class ItemBaseService {
  constructor(
    @InjectRepository(ItemBaseEntity)
    private itemBaseRepo: Repository<ItemBaseEntity>,
    private tipoItemBaseService: TipoItemBaseService,
  ) {}

  async create(createItemBaseInput: CreateItemBaseInput) {
    const { tipoItemBaseId, nome, descricao } = createItemBaseInput;

    await Promise.all([
      this.checkDuplicada(createItemBaseInput),
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

  async findAll(opt?: ListItemBaseOptionsInput) {
    const query = this.itemBaseRepo.createQueryBuilder('ib');

    if (opt && !ObjectFunctions.isObjectEmpty(opt)) {
      if (opt.buscaSimples && opt.buscaSimples.length) {
        query.innerJoin(`${query.alias}.tipoItemBase`, 'tib');
        query.where(
          new Brackets((qbW) => {
            qbW
              .where(`${query.alias}.nomeUnique ILIKE UNACCENT(LOWER(:busca))`)
              .orWhere(`tib.nome ILIKE :busca`, {
                busca: `%${opt.buscaSimples}%`,
              });
          }),
        );
      } else {
        query.where('1=1');
        if (opt.nome && opt.nome.length > 0) {
          query.andWhere(
            `${query.alias}.nomeUnique ILIKE UNACCENT(LOWER(:nome))`,
            { nome: `%${opt.nome}%` },
          );
        }
        if (opt.tipoItemBaseIds && opt.tipoItemBaseIds.length > 0) {
          query.andWhere(`${query.alias}.tipoItemBaseId IN(:...tibIds)`, {
            tibIds: opt.tipoItemBaseIds,
          });
        }
      }
    }

    query.orderBy(`${query.alias}.nomeUnique`, 'ASC');

    return await query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} itemBase`;
  }

  update(id: number, updateItemBaseInput: UpdateItemBaseInput) {
    return `This action updates a #${id} itemBase`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemBase`;
  }

  async checkDuplicada(
    dto: ItemBaseDto,
    ignoredId?: number,
  ): Promise<RespBollClass> {
    const { nome } = dto;
    if (!nome) {
      throw new BadRequestException('Nome do item-base não informado');
    }
    const query = this.itemBaseRepo
      .createQueryBuilder('ib')
      .select('ib.id')
      .where('ib.nomeUnique = :nomeU', {
        nomeU: StringFunctionsClass.toLowerUnaccent(nome),
      });

    if (ignoredId) {
      query.andWhere('ib.id <> :ibId', { ibId: ignoredId });
    }

    return await query.getOne().then(
      (resp) =>
        new RespBollClass(
          resp
            ? {
                flag: false,
                message: `Já existe um item-base com o nome "${nome}" no sistema`,
              }
            : { flag: true, message: `Nome "${nome}" pode ser usado` },
        ),
    );
  }
}
