import { Test, TestingModule } from '@nestjs/testing';
import { MarcaResolver } from './marca.resolver';

describe('MarcaResolver', () => {
  let resolver: MarcaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcaResolver],
    }).compile();

    resolver = module.get<MarcaResolver>(MarcaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
