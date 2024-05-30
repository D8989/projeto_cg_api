import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ProdutoModule } from './produto/produto.module';
import { LoaderModule } from './loader/loader.module';
import { LoaderService } from './loader/loader.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [LoaderModule],
      driver: ApolloDriver,
      useFactory: (service: LoaderService) => ({
        playground: true,
        autoSchemaFile: 'schema.gql',
        context: () => ({
          tibLoader: service.createLoaderTipoItemBase(),
          ibLoader: service.createLoaderItemBase(),
          mLoader: service.createLoaderMarca(),
        }),
      }),
      inject: [LoaderService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (confService: ConfigService) => ({
        type: 'postgres',
        host: confService.get('HOST'),
        port: confService.getInt('DB_PORT'),
        username: confService.get('USER_NAME'),
        password: confService.get('USER_PASSW'),
        database: confService.get('DB_NAME'),
        synchronize: false,
        logger: 'advanced-console',
        logging: confService.getBoll('ORM_LOG'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    ProdutoModule,
    LoaderModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
