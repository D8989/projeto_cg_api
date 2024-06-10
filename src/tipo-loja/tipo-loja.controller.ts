import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TipoLojaService } from './tipo-loja.service';

@Controller('tipo-loja')
@ApiTags('Tipo loja')
export class TipoLojaController {
  constructor(private tipoLojaService: TipoLojaService) {}
}
