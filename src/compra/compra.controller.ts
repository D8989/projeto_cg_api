import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompraService } from './compra.service';

@Controller('compra')
@ApiTags('Compra')
export class CompraController {
  constructor(private compraService: CompraService) {}
}
