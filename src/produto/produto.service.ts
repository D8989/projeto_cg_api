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
import { IUniqProduto } from './interface/uniq-produto.interface';
import { PutProdutoDto } from './dto/put-produto.dto';
import { ObjectFunctions } from 'src/common/functions/object-functions.class';

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

    const checkUnique = await this.checkUnique(dto);
    if (!checkUnique.flag) {
      throw new BadRequestException(checkUnique.message);
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

  async update(id: number, dto: PutProdutoDto, ent?: EntityManager) {
    const produto = await this.produtoRepo.findOne({ ids: [id] });
    if (!produto) {
      throw new BadRequestException('Produto não encontrado para edição');
    }
    const updateDto = ObjectFunctions.removeEmptyProperties(dto);
    if (ObjectFunctions.isObjectEmpty(updateDto)) {
      throw new BadRequestException(
        'Nenhum dado foi informado para a edição de produto',
      );
    }
    const checkDto = this.checkDto(updateDto);
    if (!checkDto.flag) {
      throw new BadRequestException(checkDto.message);
    }

    if (updateDto.marcaId) {
      const marcaExists = await this.marcaService.exits(updateDto.marcaId);
      if (!marcaExists) {
        throw new BadRequestException(
          'Marca informada não encontrada para a edição de produto.',
        );
      }
    }

    if (updateDto.itemBaseId) {
      const itemExists = await this.itemBaseService.exits(updateDto.itemBaseId);
      if (!itemExists) {
        throw new BadRequestException(
          'Item-base não encontrado para a edição de produto.',
        );
      }
    }

    const checkUnique = await this.checkUnique(
      {
        nome: updateDto.nome || produto.nome,
        quantidade: updateDto.quantidade || produto.quantidade,
        marcaId: updateDto.marcaId || produto.marcaId,
        itemBaseId: updateDto.itemBaseId || produto.itemBaseId,
      },
      produto.id,
    );
    if (!checkUnique.flag) {
      throw new BadRequestException(checkUnique.message);
    }

    const produtoEditado = new ProdutoEntity({
      ...produto,
      ...updateDto,
      id: produto.id,
      atualizadoEm: new Date(),
    });

    return await this.produtoRepo.saveOne(produtoEditado);
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

  async softDelete(id: number, ent?: EntityManager) {
    const produto = await this.produtoRepo.findOne({
      select: ['id'],
      ids: [id],
    });
    if (!produto) {
      throw new NotFoundException('produto não encontrado para a desativação');
    }

    const now = new Date();
    produto.desativadoEm = now;
    produto.atualizadoEm = now;

    await this.produtoRepo.saveOne(produto);
  }

  private checkDto(dto: CreateProdutoInput | PutProdutoDto): RespBollClass {
    if (dto.quantidade && dto.quantidade <= 0) {
      return { flag: false, message: 'Quantidade deve ser maior que zero' };
    }
    if (dto.gramatura && !['Kg', 'g', 'ml', 'l'].includes(dto.gramatura)) {
      return {
        flag: false,
        message: `gramatura está com o valor inválido ${dto.gramatura}`,
      };
    }

    return { flag: true, message: '' };
  }

  private async checkUnique(
    uniqKeys: IUniqProduto,
    ignoredId?: number,
  ): Promise<RespBollClass> {
    const produto = await this.produtoRepo.findOne({
      select: ['id'],
      ignoredId,
      nomeUnique: StringFunctionsClass.toLowerUnaccent(uniqKeys.nome),
      marcaIds: [uniqKeys.marcaId],
      itemBaseIds: [uniqKeys.itemBaseId],
      quantidades: uniqKeys.quantidade ? [uniqKeys.quantidade] : [],
    });

    if (produto) {
      return {
        flag: false,
        message: `Já existe um produto com os dados informados no sistema.`,
      };
    }

    return { flag: true, message: '' };
  }

  async getMarcaByLoader(p: ProdutoEntity) {
    const id = p.marcaId;
    return await this.marcaService.findByLoader(id).then((resp) => {
      if (!resp) {
        return this.marcaService.getMarcaDesconhecida();
      }
      return resp;
    });
  }

  async getItemBaseByLoader(p: ProdutoEntity) {
    const id = p.itemBaseId;
    return await this.itemBaseService.findByLoader(id).then((resp) => {
      if (!resp) {
      }
      return resp;
    });
  }
}
