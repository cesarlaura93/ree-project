import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ElectricBalanceResolver } from '../infrastructure/adapters/graphql/resolvers/electric-balance.resolver';
import { GetElectricBalanceUseCase } from '../core/application/use-cases/get-electric-balance.use-case';
import { MongoElectricBalanceRepository } from '../infrastructure/adapters/repositories/mongo-electric-balance.repository';
import { ElectricBalance, ElectricBalanceSchema } from '../infrastructure/database/schemas/electric-balance.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ElectricBalance.name, schema: ElectricBalanceSchema }
        ]),
        HttpModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    providers: [
        ElectricBalanceResolver,
        GetElectricBalanceUseCase,
        {
            provide: 'ElectricBalanceRepository',
            useClass: MongoElectricBalanceRepository,
        }
    ],
    exports: [GetElectricBalanceUseCase, ElectricBalanceResolver],
})
export class ElectricBalanceModule { }