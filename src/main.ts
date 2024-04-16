import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const configService = app.get(ConfigService);

  const port = configService.get('PORT');
  await app.listen(port);

  logger.log(`API criada na porta: ${port}`);
}
bootstrap();
