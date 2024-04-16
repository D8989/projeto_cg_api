import { Test, TestingModule } from '@nestjs/testing';
import { TipoItemBaseResolver } from './tipo_item_base.resolver';
import { TipoItemBaseService } from './tipo_item_base.service';

describe('TipoItemBaseResolver', () => {
  let resolver: TipoItemBaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoItemBaseResolver, TipoItemBaseService],
    }).compile();

    resolver = module.get<TipoItemBaseResolver>(TipoItemBaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
