import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LojaEntity } from './loja.entity';
import { LojaService } from './loja.service';
import { ListLojaDto } from './dto/list-loja.dto';
import { ListLojaOptionsDto } from './dto/list-loja-options.dto';
import { CreateLojaInput } from './dto/create-loja.input';

@Resolver(() => LojaEntity)
export class LojaResolver {
  constructor(private lojaService: LojaService) {}

  @Query(() => ListLojaDto, { name: 'lojas' })
  async listLojas(
    @Args({ name: 'options', type: () => ListLojaOptionsDto, nullable: true })
    opt?: ListLojaOptionsDto,
  ) {
    try {
      return new ListLojaDto(
        await this.lojaService.findPaginado(new ListLojaOptionsDto(opt)),
      );
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => LojaEntity, { name: 'createLoja' })
  async createLoja(
    @Args({ name: 'dto', type: () => CreateLojaInput })
    createDto: CreateLojaInput,
  ) {
    try {
      return await this.lojaService.create(createDto);
    } catch (error) {
      throw error;
    }
  }
}
