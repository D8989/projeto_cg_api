import { Injectable } from '@nestjs/common';
import { UsuarioRepo } from './usuario.repo';

@Injectable()
export class UsuarioService {
  constructor(private usuarioRepo: UsuarioRepo) {}
}
