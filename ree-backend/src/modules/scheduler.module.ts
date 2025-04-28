import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerService } from 'src/infrastructure/services/scheduler.service';
import { FetchElectricBalanceUseCase } from 'src/core/application/use-cases/fetch-electric-balance.use-case';
import { HttpREEApiRepository } from 'src/infrastructure/adapters/repositories/http-ree-api.repository';
import { MongoElectricBalanceRepository } from 'src/infrastructure/adapters/repositories/mongo-electric-balance.repository';
import { ElectricBalance, ElectricBalanceSchema } from 'src/infrastructure/database/schemas/electric-balance.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature([
      { name: ElectricBalance.name, schema: ElectricBalanceSchema }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    SchedulerService,
    FetchElectricBalanceUseCase,
    {
      provide: 'REEApiRepository',
      useClass: HttpREEApiRepository,
    },
    {
      provide: 'ElectricBalanceRepository',
      useClass: MongoElectricBalanceRepository,
    }
  ],
})
export class SchedulerModule {}