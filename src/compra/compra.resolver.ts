import { Resolver } from '@nestjs/graphql';
import { CompraEntity } from './compra.entity';
import { CompraService } from './compra.service';

@Resolver(() => CompraEntity)
export class CompraResolver {
  constructor(private compraService: CompraService) {}
}
