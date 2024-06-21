import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemCompraRepo } from './item-compra.repo';
import { ItemCompraEntity } from './item-compra.entity';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';
import { UpdateItemCompraDto } from './dto/update-item-compra.dto';
import { EntityManager } from 'typeorm';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { OptFuncGeral } from 'src/common/classes/opt-func-geral.class';
import { CreateItemCompraDto } from './dto/create-item-compra.dto';

@Injectable()
export class ItemCompraService {
  constructor(private itemCompraRepo: ItemCompraRepo) {}

  isEqualByPropertys(item1: ItemCompraEntity, item2: ItemCompraEntity) {
    const { id: id1, ...item1Prperty } = item1;
    const { id: id2, ...item2Prperty } = item1;
    return ObjectFunctions.deepEqual(item1Prperty, item2Prperty);
  }

  async update(
    id: number,
    updateDto: UpdateItemCompraDto,
    ent?: EntityManager,
    opt?: OptFuncGeral,
  ) {
    const dto = ObjectFunctions.removeEmptyProperties(updateDto);
    if (ObjectFunctions.isObjectEmpty(dto)) {
      throw new BadRequestException(
        'Nenhum dado foi informado para alterar o item da compra',
      );
    }

    const validDto = this.checkDto(updateDto);
    if (!validDto.flag) {
      throw new BadRequestException(validDto.message);
    }

    if (opt?.ignoreRules) {
      return await this.itemCompraRepo.save(
        new ItemCompraEntity({
          ...dto,
          id: id,
        }),
        ent,
      );
    }
  }

  async create(
    createDto: CreateItemCompraDto,
    ent?: EntityManager,
    opt?: OptFuncGeral,
  ) {
    const validDto = this.checkDto(createDto);
    if (!validDto.flag) {
      throw new BadRequestException(validDto.message);
    }

    if (opt?.ignoreRules) {
      return await this.itemCompraRepo.save(
        new ItemCompraEntity({
          ...createDto,
        }),
        ent,
      );
    }
  }

  checkDto(dto: UpdateItemCompraDto | CreateItemCompraDto): RespBollClass {
    const { custo, quantidade } = dto;
    if (custo && custo <= 0) {
      return {
        flag: false,
        message: 'Custo de item-compra não deve ser menor ou igual a zero',
      };
    }

    if (quantidade && quantidade <= 0) {
      return {
        flag: false,
        message: 'Quantidade de item-compra não deve ser menor ou igual a zero',
      };
    }

    return { flag: true, message: '' };
  }
}
