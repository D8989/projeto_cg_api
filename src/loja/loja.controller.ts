import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LojaService } from './loja.service';

@Controller('loja')
@ApiTags('Loja')
export class LojaController {
  constructor(private lojaService: LojaService) {}
}
