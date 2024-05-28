import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { createTipoItemBaseLoader } from './tipo_item_base/tipo_item_base.loader';
import { TipoItemBaseService } from './tipo_item_base/tipo_item_base.service';
import { TipoItemBaseModule } from './tipo_item_base/tipo_item_base.module';
import { ProdutoModule } from './produto/produto.module';
import { ItemBaseModule } from './item_base/item_base.module';
import { ItemBaseService } from './item_base/item_base.service';
import { createItemBaseLoader } from './item_base/item-base.loader';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [TipoItemBaseModule, ItemBaseModule],
      driver: ApolloDriver,
      useFactory: (
        tibService: TipoItemBaseService,
        ibService: ItemBaseService,
      ) => ({
        playground: true,
        autoSchemaFile: 'schema.gql',
        context: () => ({
          tibLoader: createTipoItemBaseLoader(tibService),
          ibLoader: createItemBaseLoader(ibService),
        }),
      }),
      inject: [TipoItemBaseService, ItemBaseService],
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
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
