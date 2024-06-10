import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoLojaEntity } from './tipo-loja.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoLojaRepo {
  constructor(
    @InjectRepository(TipoLojaEntity)
    private repo: Repository<TipoLojaEntity>,
  ) {}
}
