import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SchedulerModule } from './modules/scheduler.module';
import { ElectricBalanceModule } from './modules/electric-balance.module';
import databaseConfig from './infrastructure/config/database.config';
import environmentConfig from './infrastructure/config/environment.config';
import { ReeEntitiesModule } from './modules/ree-entities.module';
import { MyGqlExceptionFilter } from './infrastructure/adapters/graphql/filters/gql-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, environmentConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    }),
    SchedulerModule,
    ElectricBalanceModule,
    ReeEntitiesModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MyGqlExceptionFilter,
    },
  ],
})
export class AppModule {}
