import { TipoItemBaseEntity } from '../tipo_item_base.entity';

export class TipoItemBaseDto implements Partial<TipoItemBaseEntity> {
  nome?: string;
  descricao?: string;
}
