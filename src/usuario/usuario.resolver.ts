import { Resolver } from '@nestjs/graphql';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Resolver(() => UsuarioEntity)
export class UsuarioResolver {
  constructor(private usuarioService: UsuarioService) {}
}
