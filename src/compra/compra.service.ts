import { BadRequestException, Injectable } from '@nestjs/common';
import { CompraRepo } from './compra.repo';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';
import { CreateCompraInput } from './dto/create-compra.input';
import { LojaService } from 'src/loja/loja.service';
import { DateFunctions } from 'src/common/functions/date-functions.class';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { CompraEntity } from './compra.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CompraService {
  constructor(
    private compraRepo: CompraRepo,
    private lojaService: LojaService,
  ) {}

  async listPaginado(opt: ListCompraOptionsDto) {
    opt.limite = opt.limite || 100;

    return await this.compraRepo.findAllAndCount(opt.toIOptCompra());
  }

  async create(createDto: CreateCompraInput, ent?: EntityManager) {
    const dtoValid = this.checkDto(createDto);
    if (!dtoValid.flag) {
      throw new BadRequestException(dtoValid.message);
    }

    const { dataCompra, lojaId } = createDto;

    const lojaInput = await this.lojaService.findById(lojaId, {
      select: ['id', 'nome'],
    });
    if (!lojaInput) {
      throw new BadRequestException('Loja informada não foi encontrada');
    }

    const nextCodigo = await this.compraRepo.getNextCodigo(ent);

    return await this.compraRepo.save(
      new CompraEntity({
        dataCompra,
        lojaId,
        codigo: nextCodigo,
      }),
    );
  }

  checkDto(dto: CreateCompraInput): RespBollClass {
    const { dataCompra } = dto;
    if (dataCompra && !DateFunctions.isDateValid(dataCompra)) {
      return {
        flag: false,
        message: `Data informada "${dataCompra}" está em um formato inválido`,
      };
    }

    return { flag: true, message: '' };
  }
}
