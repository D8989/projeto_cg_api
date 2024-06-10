import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LojaEntity } from './loja.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LojaRepo {
  constructor(
    @InjectRepository(LojaEntity)
    private repo: Repository<LojaEntity>,
  ) {}
}
