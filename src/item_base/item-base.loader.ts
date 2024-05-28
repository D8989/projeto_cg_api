import * as DataLoader from 'dataloader';
import { ItemBaseEntity } from './item_base.entity';
import { ItemBaseService } from './item_base.service';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

export type IbLoader = DataLoader<number, ItemBaseEntity>;

export function createItemBaseLoader(ibService: ItemBaseService) {
  return new DataLoader<number, ItemBaseEntity>(async (ids) => {
    const ibIds = await ibService.findByIds([...ids]);
    const ibMap = ObjectFunctions.groupByKey(ibIds, 'id');
    return ids.map((id) => ibMap[id]);
  });
}
