import { Resolver } from '@nestjs/graphql';
import { LojaEntity } from './loja.entity';
import { LojaService } from './loja.service';

@Resolver(() => LojaEntity)
export class LojaResolver {
  constructor(private lojaService: LojaService) {}
}
