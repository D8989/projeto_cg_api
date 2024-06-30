import { Resolver } from '@nestjs/graphql';
import { ItemCompraEntity } from './item-compra.entity';
import { ItemCompraService } from './item-compra.service';

@Resolver(() => ItemCompraEntity)
export class ItemCompraResolver {
  constructor(private itemCompraService: ItemCompraService) {}
}
