import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemCompraService } from './item-compra.service';

@Controller('item-compra')
@ApiTags('Itens Compra')
export class ItemCompraController {
  constructor(private itemCompraService: ItemCompraService) {}
}
