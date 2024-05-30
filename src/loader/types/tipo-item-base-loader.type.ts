import DataLoader from 'dataloader';
import { TipoItemBaseEntity } from 'src/tipo_item_base/tipo_item_base.entity';

export type TibLoader = DataLoader<number, TipoItemBaseEntity>;
