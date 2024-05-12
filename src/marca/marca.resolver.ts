import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MarcaService } from './marca.service';
import { MarcaEntity } from './marca.entity';
import { CreateMarcaInput } from './dto/create-marca.input';
import { DataSource } from 'typeorm';

@Resolver(() => MarcaEntity)
export class MarcaResolver {
  constructor(
    private marcaService: MarcaService,
    private dataSource: DataSource,
  ) {}

  @Mutation(() => MarcaEntity)
  async createMarca(
    @Args({ name: 'createDto', type: () => CreateMarcaInput })
    createDto: CreateMarcaInput,
  ) {
    try {
      return await this.marcaService.createMarca(createDto);
    } catch (error) {
      throw error;
    }
  }
}
