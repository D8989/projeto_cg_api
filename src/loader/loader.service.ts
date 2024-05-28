import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';
import { ItemBaseEntity } from 'src/item_base/item_base.entity';
import { ItemBaseService } from 'src/item_base/item_base.service';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';
import { TipoItemBaseService } from 'src/tipo_item_base/tipo_item_base.service';

@Injectable()
export class LoaderService {
  constructor(
    private ibService: ItemBaseService,
    private tibService: TipoItemBaseService,
  ) {}

  async createLoaderItemBase() {
    return new DataLoader<number, ItemBaseEntity>(async (ids) => {
      const ibIds = await this.ibService.findByIds([...ids]);
      const ibMap = ObjectFunctions.groupByKey(ibIds, 'id');
      return ids.map((id) => ibMap[id]);
    });
  }

  async createLoaderTipoItemBase() {
    return new DataLoader<number, TipoItemBaseEntity>(async (ids) => {
      const tibs = await this.tibService.findByIds([...ids]);
      const tibMap = ObjectFunctions.groupByKey(tibs, 'id');
      return ids.map((id) => tibMap[id]);
    });
  }
}
