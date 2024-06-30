import { Test, TestingModule } from '@nestjs/testing';
import { ControlCompraService } from './control-compra.service';

describe('ControlCompraService', () => {
  let service: ControlCompraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlCompraService],
    }).compile();

    service = module.get<ControlCompraService>(ControlCompraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
