import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { REEApiRepository } from 'src/core/domain/repositories/ree-api.repository';
import { firstValueFrom, retry, catchError, throwError } from 'rxjs';
import { ReeApiResponse } from './entities/ree-api.entity';
import { ElectricBalanceDTO } from 'src/core/domain/entities/electric-balance.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpREEApiRepository implements REEApiRepository {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;
  private readonly logger = new Logger(HttpREEApiRepository.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const baseUrl = this.configService.get<string>('environment.reeApi.baseUrl');
    const timeout = this.configService.get<number>('environment.reeApi.timeout');
    const retryAttempts = this.configService.get<number>('environment.reeApi.retryAttempts');

    if (!baseUrl) {
      throw new Error('Missing required configuration: environment.reeApi.baseUrl');
    }
    if (timeout === undefined) {
      throw new Error('Missing required configuration: environment.reeApi.timeout');
    }
    if (retryAttempts === undefined) {
      throw new Error('Missing required configuration: environment.reeApi.retryAttempts');
    }

    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;
  }

  async fetchElectricBalance(startDate: string, endDate: string): Promise<ElectricBalanceDTO[]> {
    const params = {
      start_date: startDate,
      end_date: endDate,
      time_trunc: 'day',
    };

    this.logger.log(`Invoke API ${this.baseUrl} with timeout ${this.timeout}ms and ${this.retryAttempts} retry attempts`);

    const observable = this.httpService.get<ReeApiResponse>(this.baseUrl, {
      params,
      timeout: this.timeout,
    }).pipe(
      retry(this.retryAttempts),
      catchError(error => {
        this.logger.error(`Failed to fetch electric balance after ${this.retryAttempts} attempts: ${error.message}`, error.stack);
        return throwError(() => new Error(`Failed to fetch data from REE API: ${error.message}`));
      })
    );

    const response = await firstValueFrom(observable);

    const reeApiResponse = response.data;

    const electricBalanceDTO: ElectricBalanceDTO[] = [];
    
    reeApiResponse.included.forEach((included) => {
        included.attributes.content.forEach((content) => {
            content.attributes.values.forEach((value) => {
                electricBalanceDTO.push({
                    energy_type: included.type || '',
                    device_type: content.type || '',
                    date: new Date(value.datetime),
                    value: value.value,
                    percentage: value.percentage,
                });
            });
        });
    });

    return electricBalanceDTO;
  }
}
      