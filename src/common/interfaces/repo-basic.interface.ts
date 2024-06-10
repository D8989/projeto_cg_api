import { LiteralObject } from '@nestjs/common';
import { IFindOpt } from './find-opt.interface';

export interface RepoBasic<T extends LiteralObject, U extends IFindOpt> {
  findAllAndCount(opt: U): Promise<[T[], number]>;
  findAll(opt: U): Promise<T[]>;
  findOne(opt: U): Promise<T | null>;
}
