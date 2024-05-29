import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProdutoRepo } from './produto.repo';
import { ProdutoEntity } from './produto.entity';
import { CreateProdutoInput } from './dto/create-produto.input';
import { EntityManager } from 'typeorm';
import { RespBollClass } from 'src/common/classes/resp-boll.class';
import { MarcaService } from 'src/marca/marca.service';
import { ItemBaseService } from 'src/item_base/item_base.service';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { ListProdutoOptionsDto } from './dto/list-produto-options.dto';

@Injectable()
export class ProdutoService {
  constructor(
    private produtoRepo: ProdutoRepo,
    private marcaService: MarcaService,
    private itemBaseService: ItemBaseService,
  ) {}

  async createProduto(
    dto: CreateProdutoInput,
    ent?: EntityManager,
  ): Promise<ProdutoEntity> {
    const validDto = this.checkDto(dto);
    if (!validDto.flag) {
      throw new BadRequestException(validDto.message);
    }
    const { marcaId, itemBaseId, nome } = dto;
    const [marca, itemBase] = await Promise.all([
      this.marcaService.findMarca(marcaId, {
        select: ['id', 'nome', 'descricao'],
      }),
      this.itemBaseService.findOne(itemBaseId, {
        select: ['id', 'nome', 'descricao'],
        customSelect: { tib: ['id', 'nome', 'descricao'] },
      }),
    ]);

    if (!marca) {
      throw new BadRequestException(
        'Marca não encontrada para a criação do Produto',
      );
    }
    if (!itemBase) {
      throw new BadRequestException(
        'Item-base não encontrado para criação de Produto.',
      );
    }

    return await this.produtoRepo.saveOne(
      new ProdutoEntity({
        ...dto,
        nomeUnique: StringFunctionsClass.toLowerUnaccent(nome),
        marca: marca,
        itemBase: itemBase,
      }),
    );
  }

  async listPaginado(opt: ListProdutoOptionsDto) {
    if (!opt.limite) {
      opt.limite = 100;
    }
    return await this.produtoRepo.findAllAndCount(opt.toIFindProduto());
  }

  async fetchProduto(id: number) {
    const produto = await this.produtoRepo.findOne({
      ids: [id],
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async visualizarProduto(id: number) {
    const listOpt = new ListProdutoOptionsDto();
    listOpt.ids = [id];
    listOpt.bringMarca = true;
    listOpt.bringItemBase = true;
    listOpt.withBasicSelect = true;

    const produto = await this.produtoRepo.findOne(listOpt.toIFindProduto());
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  private checkDto(dto: CreateProdutoInput): RespBollClass {
    if (dto.quantidade <= 0) {
      return { flag: false, message: 'Quantidade deve ser maior que zero' };
    }
    if (!['Kg', 'g', 'ml', 'l'].includes(dto.gramatura)) {
      return {
        flag: false,
        message: `gramatura está com o valor inválido ${dto.gramatura}`,
      };
    }

    return { flag: true, message: '' };
  }
}
