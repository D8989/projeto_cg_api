import DataLoader from 'dataloader';
import { ItemBaseEntity } from 'src/item_base/item_base.entity';

export type IbLoader = DataLoader<number, ItemBaseEntity>;
