import { Injectable } from '@nestjs/common';
import { ItemCompraRepo } from './item-compra.repo';

@Injectable()
export class ItemCompraService {
  constructor(private itemCompraRepo: ItemCompraRepo) {}
}
