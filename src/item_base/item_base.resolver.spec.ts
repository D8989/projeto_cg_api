import { Test, TestingModule } from '@nestjs/testing';
import { ItemBaseResolver } from './item_base.resolver';
import { ItemBaseService } from './item_base.service';

describe('ItemBaseResolver', () => {
  let resolver: ItemBaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemBaseResolver, ItemBaseService],
    }).compile();

    resolver = module.get<ItemBaseResolver>(ItemBaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
