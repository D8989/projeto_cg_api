import { Test, TestingModule } from '@nestjs/testing';
import { ItemBaseService } from './item_base.service';

describe('ItemBaseService', () => {
  let service: ItemBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemBaseService],
    }).compile();

    service = module.get<ItemBaseService>(ItemBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
