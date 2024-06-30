import { Injectable } from '@nestjs/common';
import { UsuarioRepo } from './usuario.repo';
import { EntityManager } from 'typeorm';
import { StringFunctionsClass } from 'src/common/functions/string-functions.class';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(private usuarioRepo: UsuarioRepo) {}

  async getOrCreate(nome: string, ent?: EntityManager) {
    const nomeUnq = StringFunctionsClass.toLowerUnaccent(nome);
    const usuario = await this.usuarioRepo.findOne({
      nomeUnique: nomeUnq,
    });

    if (!usuario) {
      return await this.usuarioRepo.save(
        new UsuarioEntity({
          nome: nome,
          nomeUnique: nomeUnq,
        }),
        ent,
      );
    }

    return usuario;
  }
}
