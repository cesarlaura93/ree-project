import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FetchElectricBalanceUseCase } from '../../core/application/use-cases/fetch-electric-balance.use-case';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private readonly fetchElectricBalanceUseCase: FetchElectricBalanceUseCase,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.debug('Fetching electric balance data...');
        try {
            await this.fetchElectricBalanceUseCase.execute();
            this.logger.debug('Electric balance data fetched successfully');
        } catch (error) {
            this.logger.error('Error fetching electric balance data');
        }
    }
}