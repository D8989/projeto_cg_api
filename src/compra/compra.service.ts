import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompraRepo } from './compra.repo';
import { ListCompraOptionsDto } from './dto/list-compra-options.dto';
import { CreateCompraInput } from './dto/create-compra.input';
import { LojaService } from 'src/loja/loja.service';
import { DateFunctions } from 'src/common/functions/date-functions.class';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { CompraEntity } from './compra.entity';
import { EntityManager } from 'typeorm';
import { ViewListCompraDto } from './dto/view-list-compra.dto';
import { PutCompraInput } from './dto/put-compra.input';
import { ItemCompraService } from 'src/item-compra/item-compra.service';
import { CompraMask } from './dto/compra.mask';
import { ViewCompraRest } from './dto/view-compra-rest.dto';

@Injectable()
export class CompraService {
  constructor(
    private compraRepo: CompraRepo,
    private lojaService: LojaService,
    private itemCompraService: ItemCompraService,
  ) {}

  async listPaginado(opt: ListCompraOptionsDto) {
    opt.limite = opt.limite || 100;
    opt.withValorTotal = true;
    return await this.compraRepo.findAllAndCountWithValor(opt.toIOptCompra());
  }

  async getViewListCompraPaginado(
    opt: ListCompraOptionsDto,
  ): Promise<[ViewListCompraDto[], number]> {
    opt.withLoja = true;
    opt.withValorTotal = true;
    return await this.compraRepo
      .findAllAndCountWithValor(opt.toIOptCompra())
      .then((resp) => {
        return [resp[0].map((r) => this.entityToListView(r)), resp[1]];
      });
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
        loja: lojaInput,
      }),
    );
  }

  async update(id: number, dto: PutCompraInput, ent?: EntityManager) {
    const compra = await this.compraRepo.findOne({ ids: [id] });
    if (!compra) {
      throw new NotFoundException('Compra não encontrada para edição');
    }

    const { dataCompra, lojaId } = dto;
    if (lojaId) {
      const loja = await this.lojaService.findById(lojaId, { select: ['id'] });
      if (!loja) {
        throw new BadRequestException(
          `Loja informada não foi encontrada para a edição da compra ${compra.codigo}`,
        );
      }
      compra.lojaId = loja.id;
    }

    if (dataCompra) {
      compra.dataCompra = dataCompra;
    }

    compra.atualizadoEm = new Date();
    await this.compraRepo.save(compra, ent);
  }

  async deactivate(id: number, ent?: EntityManager) {
    const compra = await this.compraRepo.findOne({ ids: [id], select: ['id'] });
    if (!compra) {
      throw new NotFoundException('Compra não encontrada para a desativação');
    }

    compra.desativadoEm = new Date();
    await this.compraRepo.save(compra, ent);
  }

  async getLojaByLoader(compra: CompraEntity) {
    return await this.lojaService.findByLoader(compra.lojaId).then((resp) => {
      if (!resp) {
        throw new BadRequestException(
          `Loja da compra "${compra.codigo}" não encontrada`,
        );
      }
      return resp;
    });
  }

  async findOneCompra(listOpt: ListCompraOptionsDto) {
    return await this.compraRepo.findOne(listOpt.toIOptCompra());
  }

  async updateColumns(
    id: number,
    compraColumns: CompraMask,
    ent: EntityManager,
  ) {
    return await this.compraRepo.update(id, compraColumns, ent);
  }

  async findCompraRest(id: number) {
    const listOpt = new ListCompraOptionsDto({
      ids: [id],
      withLoja: true,
      withItens: { isInner: false, withProduto: true },
    });
    const compra = await this.compraRepo.findOne(listOpt.toIOptCompra());
    if (!compra) {
      throw new NotFoundException(`Compra não encontrada para visualização`);
    }

    return new ViewCompraRest(compra);
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

  entityToListView(compra: CompraEntity): ViewListCompraDto {
    return new ViewListCompraDto({
      id: compra.id,
      codigo: compra.codigo,
      dataCompra: compra.dataCompra,
      lojaNome: compra.loja.nome,
      valorTotal: compra.valorTotal,
    });
  }
}
