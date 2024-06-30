import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
@ApiTags('Usuário')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
}
