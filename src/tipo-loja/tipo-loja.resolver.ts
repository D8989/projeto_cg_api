import { Resolver } from '@nestjs/graphql';
import { TipoLojaEntity } from './tipo-loja.entity';
import { TipoLojaService } from './tipo-loja.service';

@Resolver(() => TipoLojaEntity)
export class TipoLojaResolver {
  constructor(private tipoLojaService: TipoLojaService) {}
}
