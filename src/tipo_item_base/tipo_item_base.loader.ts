import * as DataLoader from 'dataloader';
import { TipoItemBaseService } from './tipo_item_base.service';
import { TipoItemBaseEntity } from './tipo_item_base.entity';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

export type TibLoader = DataLoader<number, TipoItemBaseEntity>;

export function createTipoItemBaseLoader(tibService: TipoItemBaseService) {
  return new DataLoader<number, TipoItemBaseEntity>(async (ids) => {
    const tibs = await tibService.findByIds([...ids]);
    const tibMap = ObjectFunctions.groupByKey(tibs, 'id');
    return ids.map((id) => tibMap[id]);
  });
}
