import { Test, TestingModule } from '@nestjs/testing';
import { TipoItemBaseService } from './tipo_item_base.service';

describe('TipoItemBaseService', () => {
  let service: TipoItemBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoItemBaseService],
    }).compile();

    service = module.get<TipoItemBaseService>(TipoItemBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
