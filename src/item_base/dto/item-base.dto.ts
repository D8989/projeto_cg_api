import { ItemBaseEntity } from '../item_base.entity';

export class ItemBaseDto implements Partial<ItemBaseEntity> {
  nome?: string;
  descricao?: string;
  tipoItemBaseId?: number;
}
