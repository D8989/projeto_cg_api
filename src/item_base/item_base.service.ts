import { Injectable } from '@nestjs/common';
import { CreateItemBaseInput } from './dto/create-item_base.input';
import { UpdateItemBaseInput } from './dto/update-item_base.input';

@Injectable()
export class ItemBaseService {
  create(createItemBaseInput: CreateItemBaseInput) {
    return 'This action adds a new itemBase';
  }

  findAll() {
    return `This action returns all itemBase`;
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
}
